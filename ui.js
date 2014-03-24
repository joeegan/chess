//(function(){

   'use strict';

   function UI(canvasId, positions){
      this.positions = positions;
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.drawBoard();
      this.renderPiecesOnBoard();
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

   UI.prototype.handleBoardClick = function(ev){
      var mouseX = ev.pageX - this.canvas.offsetLeft,
          mouseY = ev.pageY - this.canvas.offsetTop,
          square, pieceName, squareName, piece;
      for (squareName in this.positions) {
         square = this.positions[squareName];
         pieceName = square.pieceName;
         if (this.withinSquare(mouseX, mouseY, square)) {
            if (!pieceName && !this.selectedSquare) {
               console.log('empty ' + squareName + ' clicked, no piece selected')
               this.deselectSquares();
            } else if (this.selectedSquare && square.coord === this.selectedSquare.coord) {
               console.log('same square clicked twice', square.coord);
               this.deselectSquares();
            } else if (pieceName && !this.selectedSquare) {
               console.log(pieceName, square.coord, 'selected');
               this.selectedSquare = square;
               this.selectedPiece = this.getPieceByPieceName(pieceName);
            } else if (!pieceName && this.selectedSquare) {
               console.log('empty square', squareName, 'clicked, with ' + this.selectedSquare.pieceName, this.selectedSquare.coord + ' selected');
               console.log('remove piece from', this.selectedSquare.coord);
               this.fillSquare(this.positions[this.selectedSquare.coord].colour, this.selectedSquare)
               //  Ensure piece is removed from positions
               this.clearSquare(this.selectedSquare.coord);
               console.log('place', this.selectedPiece.pieceName, squareName);
               this.place(this.selectedPiece.unicode, squareName, this.selectedPiece.pieceName);
               this.deselectSquares();
            } else if (pieceName && this.selectedSquare) {
               // block taking of own pieces
               if (pieceName.split('.')[0] === this.selectedSquare.pieceName.split('.')[0]) {
                  this.deselectSquares();
                  return;
               }
               console.log('piece selected, other piece clicked');
               console.log('capture', pieceName, 'with', this.selectedPiece.pieceName);
               this.fillSquare(this.positions[this.selectedSquare.coord].colour, this.selectedSquare)
               this.clearSquare(this.selectedSquare.coord);
               this.fillSquare(this.positions[squareName].colour, this.positions[squareName])
               this.place(this.selectedPiece.unicode, squareName, this.selectedPiece.pieceName);
               this.deselectSquares();
            }
         }
      }
   };

   UI.prototype.fillSquare = function(colour, square){
      this.ctx.fillStyle = colour;
      this.ctx.fillRect(square.x, square.y, this.squareSize , this.squareSize);
   };

   UI.prototype.clearSquare = function(coords){
      this.ctx.fillText('', this.positions[coords].x + 4, this.positions[coords].y + 48);
      this.positions[coords].pieceName = null;
      this.positions[coords].unicode = null;
      this.positions[coords].coord = coords;
   };

   UI.prototype.deselectSquares = function(){
      console.log('unselecting squares');
      this.selectedSquare = null;
      this.selectedPiece = null;
   };

   UI.prototype.drawBoard = function(){
      this.drawSquares();
      this.drawBoardEdge();
      this.placePiecesOnBoard();
      this.canvas.addEventListener('click', this.handleBoardClick.bind(this), false);
      return this;
   };

   UI.prototype.drawBoardEdge = function(){
      this.ctx.lineWidth   = 1;
      this.ctx.strokeRect(0,  0, this.canvasW, this.canvasH);
   };

   UI.prototype.placePiecesOnBoard = function(){
      var piece;
      for (var i = 0; i < C.Engine.SQUARES_PER_ROW; i++) {
         piece = C.Engine.pieces.white.pawn;
         this.place(piece.unicode, C.Engine.ALPHABET[i]+2, piece.pieceName);
         piece = C.Engine.pieces.black.pawn;
         this.place(piece.unicode, C.Engine.ALPHABET[i]+(C.Engine.SQUARES_PER_ROW-1), piece.pieceName);
      }
      for (var i = 0; i < C.Engine.PIECE_ORDER.length; i++) {
         piece = C.Engine.pieces.white[C.Engine.PIECE_ORDER[i]];
         this.place(piece.unicode, C.Engine.ALPHABET[i] + 1, piece.pieceName);
         piece = C.Engine.pieces.black[C.Engine.PIECE_ORDER[i]];
         this.place(piece.unicode, C.Engine.ALPHABET[i] + C.Engine.SQUARES_PER_ROW, piece.pieceName);
      }
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
      var colour;
      this.squareSize = this.canvasW/C.Engine.SQUARES_PER_ROW;
      for (var coord in this.positions) {
         var piece = this.positions[coord];
         this.place(piece.unicode, coord, piece.pieceName);
      }
   };

   UI.prototype.place = function(unicode, coords, pieceName) {
      if (coords) {
         this.ctx.fillStyle = UI.MEN_STROKE_COLOUR;
         this.ctx.font = UI.MEN_FONT;
         this.ctx.fillText(unicode || '', this.positions[coords].x + 4, this.positions[coords].y + 48);
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

   UI.DARK_SQUARE_COLOR = '#B58863';

   UI.LIGHT_SQUARE_COLOR = '#F0D9B5';

   UI.MEN_STROKE_COLOUR = '#000';

   UI.MEN_FONT = 'bold 54px Arial';

   UI.MOVE_MADE_EVENT = "moveMadeEvent"

   C.UI = UI;

//})();
