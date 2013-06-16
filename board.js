(function(){

   function Board(canvasId){
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      return this;
   }

   Board.prototype.drawBoard = function(){
      this.drawSquares();
      this.drawBoardEdge();
      return this;
   };

   Board.prototype.drawBoardEdge = function(){
      this.ctx.lineWidth   = 1;
      this.ctx.strokeRect(0,  0, this.canvasW, this.canvasH);
   };

   Board.prototype.positions = {};

   Board.prototype.drawSquares = function(){
      this.squareSize = this.canvasW/Board.SQUARES_PER_ROW;
      for (var y=0; y<Board.SQUARES_PER_ROW; y++) {
         for (var x=0; x<Board.SQUARES_PER_ROW; x++) {
            if (y % 2 == 0 && x % 2 !== 0
               || y % 2 !== 0 && x % 2 == 0) {
               this.ctx.fillStyle = Board.LIGHT_SQUARE_COLOR;
            } else {
               this.ctx.fillStyle = Board.DARK_SQUARE_COLOR;
            }
            this.ctx.fillRect(x*this.squareSize, y*this.squareSize, this.squareSize , this.squareSize);
            this.positions[Board.ALPHABET[x] + (Board.SQUARES_PER_ROW-y)] = { x: x*this.squareSize, y: y*this.squareSize};
        }
     }
   };

   Board.ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

   Board.DARK_SQUARE_COLOR = '#666';
   Board.LIGHT_SQUARE_COLOR = '#ccc';
   Board.SQUARES_PER_ROW = 8;

   Board.prototype.squareSize = null;

   Board.prototype.canvasH = 500;
   Board.prototype.canvasW = 500;

   Board.prototype.ctx = null;

   Chess.Board = Board;

})();