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
      this._placePieces();
      this._renderMarkings();
      this._initialiseEvents();
      this._debug = true;
      return this;
   }
   UI.prototype = Object.create(Observer.prototype);

   UI.prototype.withSwitchControl = function(switchControlId){
      this._switchControl = document.getElementById(switchControlId);
      this._switchControl.addEventListener('click', this._handleSwitchControlClick.bind(this), false);
      return this;
   };

   /**
    * Temporary console.log wrapper to control logging.
    * @param data
    * @private
    */
   UI.prototype._log = function(data){
      if (this._debug) {
         console.log(data);
      }
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
      this._positions = positions;
      this._move(selectedCoord, newCoord);
      this._deselect();

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
      this._repositionCoords();
   };

   /**
    * TODO
    */
   UI.prototype.handleCheck = function(){
      this._log('in check');
   };

   /**
    * Builds the mapping that determines the position of the squares (coords).
    * @private
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
      this._repositionCoords();
      this._moveMarkings();
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
               this._log('empty ' + squareName + ' clicked, no piece selected')
               this._deselect();
            } else if (this._selectedCoord && squareName === this._selectedCoord) {
               this._log('same square clicked twice', squareName);
               this._deselect();
            } else if (isPiece && !this._selectedCoord) {
               this._log(pieceName, squareName, 'selected');
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
      this._log('unselecting square', this._selectedCoord);
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
   UI.prototype._placePieces = function() {
      for (var coord in this._positions) {
         var piece = this._positions[coord];
         this._place(piece.unicode || '', coord);
      }
      this._highlightSelected();
   };

   /**
    * @private
    */
   UI.prototype._repositionCoords = function() {
      for (var coord in this._positions) {
         this._reposition(coord);
      }
      this._highlightSelected();
   };

   /**
    * Move a unicode chess piece to another coord on the board.
    * @param selectedCoord
    * @param newCoord
    * @private
    */
   UI.prototype._move = function(selectedCoord, newCoord){
      this._unhighlight();
      this._getEl(selectedCoord).innerHTML = '';
      this._getEl(newCoord).innerHTML = this._positions[newCoord].unicode;
      this._getEl(selectedCoord).className = 'selected';
      this._getEl(newCoord).className = 'selected';
   };

   /**
    * Highlights the selected coord.
    * @private
    */
   UI.prototype._highlightSelected = function(){
      if (this._selectedCoord) {
         this._getEl(this._selectedCoord).className = 'selected';
      }
   };

   /**
    * Removes the highlighting from all coords.
    * @private
    */
   UI.prototype._unhighlight = function(){
      var divs = Array.prototype.slice.call(document.getElementsByClassName('selected'));
      divs.forEach(function(div) {
         div.className = '';
      });
   };

   /**
    * Renders the file, 'a','b','c' and rank '1','2','3' markings on the board.
    * @private
    */
   UI.prototype._renderMarkings = function() {
      var rank, file;
      for (var i = 0; i < UI.SQUARES_PER_RANK; i++) {

         rank = document.createElement('span');
         rank.className = 'rank';
         rank.id = 'rank' + i;
         rank.innerHTML = (i + 1) + '';

         file = document.createElement('span');
         file.className = 'file';
         file.id = 'file' + UI.ALPHABET[i];
         file.innerHTML = UI.ALPHABET[i];

         this._setMarkingsStyle(i, rank, file);
         this._boardEl.appendChild(rank);
         this._boardEl.appendChild(file);
      }
   };

   /**
    * @private
    */
   UI.prototype._moveMarkings = function() {
      var rank, file;
      for (var i = 0; i < UI.SQUARES_PER_RANK; i++) {
         rank = this._getEl('rank'+i);
         file = this._getEl('file'+UI.ALPHABET[i]);
         this._setMarkingsStyle(i, rank, file);
      }
   };

   /**
    * Styles the markings elements.
    * @param {Number} i
    * @param {HTMLElement} rank
    * @param {HTMLElement} file
    * @private
    */
   UI.prototype._setMarkingsStyle = function(i, rank, file){
      var x, y;
      if (this._boardReversed) {
         x = this._coordMapping[UI.ALPHABET[i] + 8].x;
         y = this._coordMapping['h' + (i+1)].y;
      } else {
         x = this._coordMapping[UI.ALPHABET[i] + 1].x;
         y = this._coordMapping['a' + (i+1)].y;
      }
      file.style.left = x + 'px';
      rank.style.top = y + 'px';
   };

   /**
    * Create a coord element and place it on the board.
    * @param {String} unicode
    * @param {String} coord a1
    * @private
    */
   UI.prototype._place = function(unicode, coord) {
      var newEl = document.createElement('div');
      this._setPosStyleForCoord(coord, newEl);
      newEl.innerHTML = unicode || '';
      newEl.id = coord;
      this._boardEl.appendChild(newEl);
   };

   /**
    * Sets new style properties on the coord based on this._coordMapping.
    * @param coord
    * @private
    */
   UI.prototype._reposition = function(coord) {
      var el = this._getEl(coord);
      this._setPosStyleForCoord(coord, el);
   };

   /**
    * @param coord
    * @returns {string}
    * @private
    */
   UI.prototype._setPosStyleForCoord = function(coord, el) {
      el.style.left = this._coordMapping[coord].x + 'px';
      el.style.top = this._coordMapping[coord].y + 'px';
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