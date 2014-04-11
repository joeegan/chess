(function(){

   'use strict';

   function UI(canvasId, positions){
      this.positions = positions;
      this._canvas = document.getElementById(canvasId);
      this._ctx = this._canvas.getContext('2d');
      this._drawBoard();
      this._buildCoordMapping();
      this._renderPiecesOnBoard();
      this._initialiseEvents();
      return this;
   }

   UI.prototype = Object.create(Subscribable.prototype);

   UI.prototype._initialiseEvents = function() {
      this._canvas.addEventListener('click', this._handleBoardClick.bind(this), false);
   };

   UI.prototype.handleMoveDeemedLegal = function() {
      this._drawSquares();
      this._renderPiecesOnBoard();
      this._deselectSquares();
   };

   UI.prototype.handleMoveDeemedIllegal = function() {
      this._deselectSquares();
   };

   UI.prototype._selectedSquare = null;

   UI.prototype._squareSize = null;

   UI.prototype._canvasH = 500;

   UI.prototype._canvasW = 500;

   UI.prototype._ctx = null;

   /*
    * Stores the x and y coordinates of each position e.g. a1 {x: 0, y: 0, colour: #000}, b1 etc.
    */
   UI.prototype._coordMapping = {};

   // Consider merging with _drawSquares
   UI.prototype._buildCoordMapping = function(){
      this._squareSize = this._canvasW/UI.SQUARES_PER_ROW;
      for (var y = 0; y < UI.SQUARES_PER_ROW; y++) {
         for (var x = 0; x < UI.SQUARES_PER_ROW; x++) {
            this._coordMapping[UI.ALPHABET[x] + (UI.SQUARES_PER_ROW-y)] = {
               x: x*this._squareSize,
               y: y*this._squareSize,
               colour: this._squareColorResolver(x, y)
            };
         }
      }
   };

   UI.prototype._handleBoardClick = function(ev){
      var mouseX = ev.pageX - this._canvas.offsetLeft,
          mouseY = ev.pageY - this._canvas.offsetTop,
          squareXY, pieceName, squareName, piece, operator, lan;
      for (squareName in this.positions) {
         squareXY = this._coordMapping[squareName];
         pieceName = this.positions[squareName].constructor.name;
         if (this._withinSquare(mouseX, mouseY, squareXY)) {
            var isPiece = this.positions[squareName] instanceof C.Piece;
            if (!isPiece && !this._selectedSquare) {
               console.log('empty ' + squareName + ' clicked, no piece selected')
               this._deselectSquares();
            } else if (this._selectedSquare && squareName === this._selectedSquare) {
               console.log('same square clicked twice', squareName);
               this._deselectSquares();
            } else if (isPiece && !this._selectedSquare) {
               console.log(pieceName, squareName, 'selected');
               this._selectedSquare = squareName;
            } else if (!isPiece && this._selectedSquare || isPiece && this._selectedSquare) {
               operator = isPiece ? 'x' : '-';
               lan = this._selectedSquare + operator + squareName;
               console.log(lan);
               this.fire(UI.HUMAN_MOVE_MADE_EVENT, lan, true);
            }
         }
      }
   };

   UI.prototype._deselectSquares = function(){
      console.log('unselecting square', this._selectedSquare);
      this._selectedSquare = null;
   };

   UI.prototype._drawBoard = function(){
      this._drawSquares();
      this._drawBoardEdge();
      return this;
   };

   UI.prototype._drawBoardEdge = function(){
      this._ctx.lineWidth   = 1;
      this._ctx.strokeRect(0,  0, this._canvasW, this._canvasH);
   };

   UI.prototype._withinSquare = function(x, y, square){
      return y > square.y
         && y < square.y + this._squareSize
         && x > square.x
         && x < square.x + this._squareSize;
   };

   UI.prototype._renderPiecesOnBoard = function() {
      this._squareSize = this._canvasW/C.Engine.SQUARES_PER_ROW;
      for (var coord in this.positions) {
         var piece = this.positions[coord];
         this._place(piece.unicode, coord);
      }
   };

   UI.prototype._place = function(unicode, coords) {
      if (coords) {
         this._ctx.fillStyle = UI.MEN_STROKE_COLOUR;
         this._ctx.font = UI.MEN_FONT;
         this._ctx.fillText(unicode || '', this._coordMapping[coords].x + 4, this._coordMapping[coords].y + 48);
      }
   };

   UI.prototype._drawSquares = function(){
      var colour;
      this._squareSize = this._canvasW/C.Engine.SQUARES_PER_ROW;
      for (var y=0; y<C.Engine.SQUARES_PER_ROW; y++) {
         for (var x=0; x<C.Engine.SQUARES_PER_ROW; x++) {
            colour = this._squareColorResolver(x, y);
            this._ctx.fillStyle = colour;
            this._ctx.lineWidth = 1;
            this._ctx.fillRect(x*this._squareSize, y*this._squareSize, this._squareSize , this._squareSize);
            this._ctx.strokeStyle = '#fff';
            this._ctx.strokeRect(x*this._squareSize, y*this._squareSize, this._squareSize , this._squareSize);

         }
      }
   };

   UI.prototype._squareColorResolver = function(x, y){
      if ((x+y) & 1) {
         return UI.DARK_SQUARE_COLOR;
      } else {
         return UI.LIGHT_SQUARE_COLOR;
      }
   };

   UI.ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

   UI.SQUARES_PER_ROW = 8;

   UI.DARK_SQUARE_COLOR = '#B58863';

   UI.LIGHT_SQUARE_COLOR = '#F0D9B5';

   UI.MEN_STROKE_COLOUR = '#000';

   UI.MEN_FONT = 'bold 54px Arial';

   UI.HUMAN_MOVE_MADE_EVENT = "humanMadeMoveEvent"

   C.UI = UI;

})();