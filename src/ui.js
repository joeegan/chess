(function(){

   'use strict';

   /**
    * @param {String} boardId
    * @param {Object} positions
    * @param {Boolean} reversed
    * @returns {*}
    * @constructor
    */
   function UI(boardId, positions, reversed){
      this._positions = positions;
      this._boardEl = document.getElementById(boardId);
      this._boardReversed = reversed;
      this._buildCoordMapping();
      this._placeAllPiecesOnBoard();
      this._renderMarkings();
      this._initialiseEvents();
      return this;
   }
   UI.prototype = Object.create(Observer.prototype);

   UI.prototype.withSwitchControl = function(switchControlId){
      this._switchControl = document.getElementById(switchControlId);
      this._switchControl.addEventListener('click', this._handleSwitchControlClick.bind(this), false);
      return this;
   };

   /**
    * Local reference of C.Engine.positions.
    * @type {{C.Piece|Object}} e.g { a1: C.Rook, a2: C.Pawn, a3: {} }
    */
   UI.prototype.positions = null;

   /**
    * Whether the board has black pieces at the bottom.
    * @type {Boolean}
    */
   UI.prototype._boardReversed = null;

   /**
    * The coord the player intends to move to.
    * @type {String} e.g. e2
    */
   UI.prototype._selectedCoord = null;

   /**
    * The calculated square size in pixels based on the size of the board.
    * @type {Number} e.g. e2
    */
   UI.prototype._squareSize = null;

   /**
    * Stores the x and y coordinates of each position e.g. a1 {x: 0, y: 0, colour: #000}, b1 etc.
    * @type {Object}
    */
   UI.prototype._coordMapping = null;

   /**
    * Attaches handlers to DOM events.
    */
   UI.prototype._initialiseEvents = function() {
      this._boardEl.addEventListener('click', this._handleBoardClick.bind(this), false);
   };

   /**
    * @param {Object} _positions Coords with pieces.
    * @param {String} lan e.g. Pe2-e5
    * @param {String} turn e.g. 'white'
    * @param {selectedCoord} e.g. e2
    * @param {newCoord} e.g e5
    */
   UI.prototype.handleMoveDeemedLegal = function(positions, lan, turn, selectedCoord, newCoord) {
      this._place('', selectedCoord);
      this._place(positions[newCoord].unicode, newCoord);
      this._deselect();
      var divs = Array.prototype.slice.call(document.getElementsByClassName('selected'));
      divs.forEach(function(div) {
         div.className = '';
      });
      this._getEl(selectedCoord).className = 'selected';
      this._getEl(newCoord).className = 'selected';
   };

   /**
    * @param {Object} positions Coords with pieces.
    * @param {selectedCoord} e.g. e2
    * @param {newCoord} e.g e5
    */
   UI.prototype.handleMoveDeemedIllegal = function(positions, selectedCoord, newCoord) {
      this._getEl(selectedCoord).className = '';
      this._getEl(newCoord).className = '';
      this._deselect();
   };

   /**
    * @param {Object} positions Coords with pieces.
    */
   UI.prototype.handleMoveLogProcessed = function(positions){
      this._positions = positions;
      this._clearBoard();
      this._placeAllPiecesOnBoard();
      this._renderMarkings();
   };

   /**
    * Builds this._coordMapping
    */
   UI.prototype._buildCoordMapping = function(){
      var rank, file, yMultiplier;
      var alphabet = this._boardReversed ? UI.ALPHABET.slice().reverse() : UI.ALPHABET;
      this._coordMapping = {};
      this._squareSize = this._boardEl.getAttribute('width')/UI.SQUARES_PER_RANK;
      this._boardEl.className = this._boardReversed ? 'reversed' : '';
      for (rank = 0; rank < UI.SQUARES_PER_RANK; rank++) {
            for (file = 0; file < UI.SQUARES_PER_RANK; file++) {
               yMultiplier = this._boardReversed ? (UI.SQUARES_PER_RANK - (rank+1)) : rank;
               this._coordMapping[alphabet[file] + (UI.SQUARES_PER_RANK-rank)] = {
               x: file * this._squareSize,
               y: yMultiplier * this._squareSize
            };
         }
      }
   };

   /**
    * Handles the Switch control being clicked to reverse the view.
    * @param {Object} ev DOM event
    * @private
    */
   UI.prototype._handleSwitchControlClick = function(ev){
      this._boardReversed = !this._boardReversed;
      this._buildCoordMapping();
      this._placeAllPiecesOnBoard();
      this._renderMarkings();
   };

   /**
    * TODO - This was originally written for canvas, rewrite without the _withinSquare shenanigans.
    * @param {Object} ev DOM event
    * @private
    */
   UI.prototype._handleBoardClick = function(ev){
      var mouseX = ev.pageX - this._boardEl.offsetLeft,
          mouseY = ev.pageY - this._boardEl.offsetTop,
          squareXY, pieceName, squareName, piece, lan;
      for (squareName in this._positions) {
         squareXY = this._coordMapping[squareName];
         pieceName = this._positions[squareName].notation;
         if (this._withinSquare(mouseX, mouseY, squareXY)) {
            var isPiece = this._positions[squareName] instanceof C.Piece;
            if (!isPiece && !this._selectedCoord) {
               console.log('empty ' + squareName + ' clicked, no piece selected')
               this._deselect();
            } else if (this._selectedCoord && squareName === this._selectedCoord) {
               console.log('same square clicked twice', squareName);
               this._deselect();
            } else if (isPiece && !this._selectedCoord) {
               console.log(pieceName, squareName, 'selected');
               this._selectedCoord = squareName;
               this._getEl(this._selectedCoord).className = 'selected';
            } else if (!isPiece && this._selectedCoord || isPiece && this._selectedCoord) {
               lan = this._buildLan(this._selectedCoord, squareName, isPiece);
               this._getEl(squareName).className = 'selected';
               this.publish(UI.HUMAN_MOVE_MADE_EVENT, lan, true);
            }
         }
      }
   };

   /**
    * @param {String} selectedCoord
    * @param {String} newCoord
    * @param {Boolean} isPieceOnNewCoord
    * @returns {String} e.g. Pc2-c5
    */
   UI.prototype._buildLan = function(selectedCoord, newCoord, isPieceOnNewCoord){
      return this._positions[selectedCoord].notation
             + selectedCoord
             + (isPieceOnNewCoord ? 'x' : '-')
             + newCoord;
   };

   /**
    * Deselects the selected coord.
    * @private
    */
   UI.prototype._deselect = function(){
      console.log('unselecting square', this._selectedCoord);
      this._selectedCoord = null;
   };

   /**
    * TODO: Remove, it's a relic from the canvas UI.
    * @deprecated
    * @private
    */
   UI.prototype._withinSquare = function(x, y, square){
      return y > square.y
         && y < square.y + this._squareSize
         && x > square.x
         && x < square.x + this._squareSize;
   };

   /**
    * Places the pieces in this._positions on the board.
    * @private
    */
   UI.prototype._placeAllPiecesOnBoard = function() {
      this._squareSize = this._boardEl.getAttribute('width')/C.Engine.SQUARES_PER_RANK;
      for (var coord in this._positions) {
         var piece = this._positions[coord];
         this._place(piece.unicode || '', coord);
      }
      if (this._selectedCoord) {
         this._getEl(this._selectedCoord).className = 'selected';
      }
   };

   /**
    * Renders the file, 'a','b','c' and rank '1','2','3' markings on the board.
    * @private
    */
   UI.prototype._renderMarkings = function() {
      var rank, file, rankCoordRef, fileCoordRef, fileStyle, rankStyle;
      var markingsRendered = !!this._getEl('rank0');
      for (var i = 0; i < UI.SQUARES_PER_RANK; i++) {
         if (markingsRendered) {
            rank = this._getEl('rank'+i);
            file = this._getEl('file'+UI.ALPHABET[i]);
         } else {
            rank = document.createElement('span');
            file = rank.cloneNode();
            rank.className = 'rank';
            rank.setAttribute('id', 'rank'+i);
            file.className = 'file';
            file.setAttribute('id', 'file'+UI.ALPHABET[i]);
         }
         rank.innerHTML = (i+1)+'';
         file.innerHTML = UI.ALPHABET[i];
         if (this._boardReversed) {
            rankCoordRef = this._coordMapping[UI.ALPHABET[UI.SQUARES_PER_RANK - 1] + (i+1)];
            fileCoordRef = this._coordMapping[UI.ALPHABET[i] + UI.SQUARES_PER_RANK];
         } else {
            rankCoordRef = this._coordMapping[UI.ALPHABET[0] + (i+1)];
            fileCoordRef = this._coordMapping[UI.ALPHABET[i] + 1];
         }
         fileStyle = "left:" + fileCoordRef.x + "px;";
         rankStyle = "top:" + rankCoordRef.y  + "px;";
         file.setAttribute('style', fileStyle);
         rank.setAttribute('style', rankStyle);
         if (!markingsRendered) {
            this._boardEl.appendChild(rank);
            this._boardEl.appendChild(file);
         }
      }
   };

   /**
    * Place a piece on the board.
    * @param {String} unicode
    * @param {String} coord a1
    * @private
    */
   UI.prototype._place = function(unicode, coord) {
      var el;
      if (coord) {
         // TODO move to alternative _move function
         if (this._getEl(coord)) {
            el = this._getEl(coord);
            el.innerHTML = unicode || '';
            var style = "left:" + this._coordMapping[coord].x + "px;";
            style += "top:" + this._coordMapping[coord].y  + "px;";
            el.setAttribute('style', style);
         } else {
            var style = "left:" + this._coordMapping[coord].x + "px;";
            style += "top:" + this._coordMapping[coord].y  + "px;";
            var newEl = document.createElement('div');
            newEl.setAttribute('style', style);
            newEl.innerHTML = unicode || '';
            newEl.id = coord;
            this._boardEl.appendChild(newEl);
         }
      }
   };

   /**
    * Finds a coord element within the context of the board.
    * @param {String}
    * @returns {HTMLElement}
    */
   UI.prototype._getEl = function(id) {
      return this._boardEl.querySelector('#' + id);
   };

   /**
    * The file names.
    * @type {String[]}
    */
   UI.ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

   /**
    * @type {Number}
    */
   UI.SQUARES_PER_RANK = 8;

   /**
    * @type {String}
    */
   UI.HUMAN_MOVE_MADE_EVENT = "humanMadeMoveEvent";

   C.UI = UI;

})();