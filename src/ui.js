(function(){

   'use strict';

   function UI(boardId, positions){
      this.positions = positions;
      this._boardEl = document.getElementById(boardId);
      this._buildCoordMapping();
      this._renderPiecesOnBoard();
      this._initialiseEvents();
      return this;
   }

   UI.prototype = Object.create(Observer.prototype);

   UI.prototype._initialiseEvents = function() {
      this._boardEl.addEventListener('click', this._handleBoardClick.bind(this), false);
   };

   UI.prototype.handleMoveDeemedLegal = function(positions, lan, turn, selectedCoord, newCoord) {
      this._renderPiecesOnBoard();
      this._deselectSquares();
      var divs = Array.prototype.slice.call(document.getElementsByClassName('selected'));
      divs.forEach(function(div) {
         div.className = '';
      });
      document.getElementById(selectedCoord).className = 'selected';
      document.getElementById(newCoord).className = 'selected';
   };

   UI.prototype.handleMoveDeemedIllegal = function(positions, selectedCoord, newCoord) {
      document.getElementById(selectedCoord).className = '';
      document.getElementById(newCoord).className = '';
      this._deselectSquares();
   };

   UI.prototype._selectedCoord = null;

   UI.prototype._squareSize = null;

   UI.prototype._borderWidth = 0;

   /*
    * Stores the x and y coordinates of each position e.g. a1 {x: 0, y: 0, colour: #000}, b1 etc.
    */
   UI.prototype._coordMapping = {};

   // Consider merging with _drawSquares
   UI.prototype._buildCoordMapping = function(){
      this._squareSize = Math.floor(this._boardEl.getAttribute('width')/UI.SQUARES_PER_RANK);
      for (var y = 0; y < UI.SQUARES_PER_RANK; y++) {
         for (var x = 0; x < UI.SQUARES_PER_RANK; x++) {
            this._coordMapping[UI.ALPHABET[x] + (UI.SQUARES_PER_RANK-y)] = {
               x: Math.floor(x*this._squareSize + this._borderWidth),
               y: Math.floor(y*this._squareSize + this._borderWidth),
               colour: this._squareColorResolver(x, y)
            };
         }
      }
   };

   UI.prototype._handleBoardClick = function(ev){
      var mouseX = ev.pageX - this._boardEl.offsetLeft,
          mouseY = ev.pageY - this._boardEl.offsetTop,
          squareXY, pieceName, squareName, piece, operator, lan;
      for (squareName in this.positions) {
         squareXY = this._coordMapping[squareName];
         pieceName = this.positions[squareName].notation;
         if (this._withinSquare(mouseX, mouseY, squareXY)) {
            var isPiece = this.positions[squareName] instanceof C.Piece;
            if (!isPiece && !this._selectedCoord) {
               console.log('empty ' + squareName + ' clicked, no piece selected')
               this._deselectSquares();
            } else if (this._selectedCoord && squareName === this._selectedCoord) {
               console.log('same square clicked twice', squareName);
               this._deselectSquares();
            } else if (isPiece && !this._selectedCoord) {
               console.log(pieceName, squareName, 'selected');
               this._selectedCoord = squareName;
               document.getElementById(this._selectedCoord).className = 'selected';
            } else if (!isPiece && this._selectedCoord || isPiece && this._selectedCoord) {
               lan = this.buildLan(this._selectedCoord, squareName, isPiece);
               document.getElementById(squareName).className = 'selected';
               this.publish(UI.HUMAN_MOVE_MADE_EVENT, lan, true);
            }
         }
      }
   };

   UI.prototype.buildLan = function(selectedCoord, newCoord, isPieceOnNewCoord){
      var operator = isPieceOnNewCoord ? 'x' : '-';
      var lan = this.positions[selectedCoord].notation;
      return lan += selectedCoord + operator + newCoord;
   };

   UI.prototype.handleMoveLogProcessed = function(positions){
     this.positions = positions;
      this._drawBoard();
     this._renderPiecesOnBoard();
   };

   UI.prototype._deselectSquares = function(){
      console.log('unselecting square', this._selectedCoord);
      this._selectedCoord = null;
   };

   UI.prototype._withinSquare = function(x, y, square){
      return y > square.y
         && y < square.y + this._squareSize
         && x > square.x
         && x < square.x + this._squareSize;
   };

   UI.prototype._renderPiecesOnBoard = function() {
      this._clearBoard();
      this._squareSize = Math.floor(this._boardEl.getAttribute('width')/C.Engine.SQUARES_PER_RANK);
      for (var coord in this.positions) {
         var piece = this.positions[coord];
         this._place(piece.unicode, coord);
      }
   };

   UI.prototype._clearBoard = function(){
      var divs = Array.prototype.slice.call(this._boardEl.children);
      divs.forEach(function(div) {
         div.innerHTML = '';
      });
   };

   UI.prototype._place = function(unicode, coords) {
      if (coords) {
         var newEl = document.createElement('div');
         newEl.style.position = 'absolute';
         var left = this._coordMapping[coords].x;
         var top = this._coordMapping[coords].y;
         var style = "left:" +  left + "px;";
         style += "top:" + top  + "px;";
         style += "width:" + this._squareSize  + "px;";
         style += "height:" + this._squareSize  + "px;";
         style += "line-height:" + this._squareSize  + "px;";
         newEl.setAttribute('style', style);
         newEl.innerHTML = unicode || '';
         newEl.id = coords;
         this._boardEl.appendChild(newEl);
      }
   };



   UI.prototype._squareColorResolver = function(x, y){
      if ((x+y) & 1) {
         return UI.DARK_SQUARE_COLOR;
      } else {
         return UI.LIGHT_SQUARE_COLOR;
      }
   };

   UI.SQUARE_TEMPLATE = '<span></span>';

   UI.ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

   UI.SQUARES_PER_RANK = 8;

   UI.DARK_SQUARE_COLOR = '#B58863';

   UI.LIGHT_SQUARE_COLOR = '#F0D9B5';

   UI.MEN_STROKE_COLOUR = '#000';

   UI.MEN_FONT = 'bold 54px Arial';

   UI.HUMAN_MOVE_MADE_EVENT = "humanMadeMoveEvent";

   C.UI = UI;

})();