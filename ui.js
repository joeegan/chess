//(function(){

   'use strict';

   function UI(canvasId, positions){
      this.positions = positions;
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.drawBoard();
      this.buildCoordMapping();
      this.renderPiecesOnBoard();
      this.canvas.addEventListener('click', this.handleBoardClick.bind(this), false);
      return this;
   }

   UI.prototype.initialiseEvents = function() {
//      this.on(C.Engine.POSITIONS_UPDATED_EVENT, this.placePositions);
//      this.fire(UI.MOVE_MADE_EVENT, move)
   };

   UI.prototype.selectedSquare = null;

   UI.prototype.selectedPiece = null;

   UI.prototype.squareSize = null;

   UI.prototype.canvasH = 500;

   UI.prototype.canvasW = 500;

   UI.prototype.ctx = null;

   /*
    * Stores the x and y coordinates of each position e.g. a1 {x: 0, y: 0, colour: #000}, b1 etc.
    */
   UI.prototype.coordMapping = {};

   // TODO consider merging with drawBoard
   UI.prototype.buildCoordMapping = function(){
      this.squareSize = this.canvasW/UI.SQUARES_PER_ROW;
      for (var y=0; y<UI.SQUARES_PER_ROW; y++) {
         for (var x=0; x<UI.SQUARES_PER_ROW; x++) {
            this.coordMapping[UI.ALPHABET[x] + (UI.SQUARES_PER_ROW-y)] = {
               x: x*this.squareSize,
               y: y*this.squareSize,
               colour: this.squareColorResolver(x, y)
            };
         }
      }
   };

   UI.prototype.handleBoardClick = function(ev){
      var mouseX = ev.pageX - this.canvas.offsetLeft,
          mouseY = ev.pageY - this.canvas.offsetTop,
          squareXY, pieceName, squareName, piece;
      for (squareName in this.positions) {
         squareXY = this.coordMapping[squareName];
         pieceName = this.positions[squareName].pieceName;
         if (this.withinSquare(mouseX, mouseY, squareXY)) {
            if (!pieceName && !this.selectedSquare) {
               console.log('empty ' + squareName + ' clicked, no piece selected')
               this.deselectSquares();
            } else if (this.selectedSquare && squareName === this.selectedSquare) {
               console.log('same square clicked twice', squareName);
               this.deselectSquares();
            } else if (pieceName && !this.selectedSquare) {
               console.log(pieceName, squareName, 'selected');
               this.selectedSquare = squareName;
               this.selectedPiece = this.getPieceByPieceName(pieceName);
            } else if (!pieceName && this.selectedSquare) {
               console.log('empty square', squareName, 'clicked, with ' + this.selectedPiece.pieceName, this.selectedSquare + ' selected');
               console.log('remove piece from', this.selectedSquare);
               this.fillSquare(this.coordMapping[this.selectedSquare]);
               //  Ensure piece is removed from positions
//               this.clearSquare(this.selectedSquare);
               console.log('place', this.selectedPiece.pieceName, squareName);
               this.place(this.selectedPiece.unicode, squareName);
               this.deselectSquares();
            } else if (pieceName && this.selectedSquare) {
               // block taking of own pieces
               if (pieceName.split('.')[0] === this.selectedSquare.pieceName.split('.')[0]) {
                  this.deselectSquares();
                  return;
               }
               console.log('piece selected, other piece clicked');
               console.log('capture', pieceName, 'with', this.selectedPiece.pieceName);
               this.fillSquare(this.coordMapping[this.selectedSquare]);
//               this.clearSquare(this.selectedSquare);
               this.fillSquare(this.coordMapping[squareName]);
               this.place(this.selectedPiece.unicode, this.coordMapping[squareName]);
               this.deselectSquares();
            }
         }
      }
   };

   UI.prototype.fillSquare = function(coords){
      this.ctx.fillStyle = coords.colour;
      this.ctx.fillRect(coords.x, coords.y, this.squareSize , this.squareSize);
   };

   // TODO reintroduce this function to enable clicking on squares that once occupied men.
   UI.prototype.clearSquare = function(coords){
      this.ctx.fillText('', this.coordMapping[coords].x + 4, this.coordMapping[coords].y + 48);
      this.positions[coords].pieceName = null;
      this.positions[coords].unicode = null;
   };

   UI.prototype.deselectSquares = function(){
      console.log('unselecting squares');
      this.selectedSquare = null;
      this.selectedPiece = null;
   };

   UI.prototype.drawBoard = function(){
      this.drawSquares();
      this.drawBoardEdge();
      return this;
   };

   UI.prototype.drawBoardEdge = function(){
      this.ctx.lineWidth   = 1;
      this.ctx.strokeRect(0,  0, this.canvasW, this.canvasH);
   };

   UI.prototype.getPieceByPieceName = function(pieceName){
      return C.Engine.pieces[pieceName.split('.')[0]][pieceName.split('.')[1]];
   };

   UI.prototype.withinSquare = function(x, y, square){
      return y > square.y
         && y < square.y + this.squareSize
         && x > square.x
         && x < square.x + this.squareSize;
   };

   UI.prototype.renderPiecesOnBoard = function() {
      this.squareSize = this.canvasW/C.Engine.SQUARES_PER_ROW;
      for (var coord in this.positions) {
         var piece = this.positions[coord];
         this.place(piece.unicode, coord, piece.pieceName);
      }
   };

   UI.prototype.place = function(unicode, coords) {
      if (coords) {
         this.ctx.fillStyle = UI.MEN_STROKE_COLOUR;
         this.ctx.font = UI.MEN_FONT;
         this.ctx.fillText(unicode || '', this.coordMapping[coords].x + 4, this.coordMapping[coords].y + 48);
//         this.engine.feed(this.positions[coords]);
      }
   };

   UI.prototype.drawSquares = function(){
      var colour;
      this.squareSize = this.canvasW/C.Engine.SQUARES_PER_ROW;
      for (var y=0; y<C.Engine.SQUARES_PER_ROW; y++) {
         for (var x=0; x<C.Engine.SQUARES_PER_ROW; x++) {
            colour = this.squareColorResolver(x, y);
            this.ctx.fillStyle = colour;
            this.ctx.lineWidth = 1;
            this.ctx.fillRect(x*this.squareSize, y*this.squareSize, this.squareSize , this.squareSize);
            this.ctx.strokeStyle = '#fff';
            this.ctx.strokeRect(x*this.squareSize, y*this.squareSize, this.squareSize , this.squareSize);

         }
      }
   };

   UI.prototype.squareColorResolver = function(x, y){
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

   UI.MOVE_MADE_EVENT = "moveMadeEvent"

   C.UI = UI;

//})();
