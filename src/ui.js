(function(){

   'use strict';

   /**
    * @param {String} boardId
    * @param {Object} positions
    * @returns {*}
    * @constructor
    */
   function UI(boardId, positions){
      this._positions = positions;
      this._boardEl = document.getElementById(boardId);
      this._buildCoordMapping();
      this._renderPiecesOnBoard();
      this._initialiseEvents();
      return this;
   }
   UI.prototype = Object.create(Observer.prototype);

   /**
    * Local reference of C.Engine.positions.
    * @type {{C.Piece|Object}} e.g { a1: C.Rook, a2: C.Pawn, a3: {} }
    */
   UI.prototype.positions = null;

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
      this._renderPiecesOnBoard();
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
      this._renderPiecesOnBoard();
   };

   /**
    * Builds this._coordMapping
    */
   UI.prototype._buildCoordMapping = function(){
      this._coordMapping = {};
      this._squareSize = Math.floor(this._boardEl.getAttribute('width')/UI.SQUARES_PER_RANK);
      for (var y = 0; y < UI.SQUARES_PER_RANK; y++) {
         for (var x = 0; x < UI.SQUARES_PER_RANK; x++) {
            this._coordMapping[UI.ALPHABET[x] + (UI.SQUARES_PER_RANK-y)] = {
               x: Math.floor(x*this._squareSize),
               y: Math.floor(y*this._squareSize)
            };
         }
      }
   };

   /**
    * TODO - This was originally written for canvas, rewrite without the _withinSquare shenanigans.
    * @param {Object} ev DOM event
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
   UI.prototype._renderPiecesOnBoard = function() {
      this._clearBoard();
      this._squareSize = this._boardEl.getAttribute('width')/C.Engine.SQUARES_PER_RANK;
      for (var coord in this._positions) {
         var piece = this._positions[coord];
         this._place(piece.unicode, coord);
      }
   };

   /**
    * Removes all pieces from the board.
    * @private
    */
   UI.prototype._clearBoard = function(){
      var divs = Array.prototype.slice.call(this._boardEl.children);
      for (var i = 0; i < divs.length; i++) {
         divs[i].innerHTML = '';
      }
   };

   /**
    * Place a piece on the board.
    * @param {String} unicode
    * @param {String} coords {x: 0, y: 0}
    * @private
    */
   UI.prototype._place = function(unicode, coords) {
      if (coords) {
         var newEl = document.createElement('div');
         var style = "left:" + this._coordMapping[coords].x + "px;";
         style += "top:" + this._coordMapping[coords].y  + "px;";
         style += "width:" + this._squareSize + "px;";
         style += "height:" + this._squareSize + "px;";
         style += "line-height:" + this._squareSize  + "px;";
         newEl.setAttribute('style', style);
         newEl.innerHTML = unicode || '';
         newEl.id = coords;
         this._boardEl.appendChild(newEl);
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
    * @type {number}
    */
   UI.SQUARES_PER_RANK = 8;

   /**
    * @type {string}
    */
   UI.HUMAN_MOVE_MADE_EVENT = "humanMadeMoveEvent";

   C.UI = UI;

})();