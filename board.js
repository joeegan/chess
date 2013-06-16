(function(){

   function Board(canvasId){
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      return this;
   }

   Board.prototype.drawBoard = function(){
      this.drawBoardEdge();
      this.drawSquares();
   };

   Board.prototype.drawBoardEdge = function(){
      this.ctx.lineWidth   = 1;
      this.ctx.strokeRect(0,  0, this.canvasW, this.canvasH);
   };

   Board.prototype.drawSquares = function(){
     this.squareSize = this.canvasW/8;
      var odd = 1;
     for (var y=0; y<8; y++) {
        for (var x=0; x<8; x++) {
           if (y % 2 == 0 && x % 2 !== 0
              || y % 2 !== 0 && x % 2 === 0) {
              this.ctx.fillStyle = Board.LIGHT_SQUARE_COLOR;
           } else {
              this.ctx.fillStyle = Board.DARK_SQUARE_COLOR;
           }
           this.ctx.fillRect(x*this.squareSize, y*this.squareSize, this.squareSize , this.squareSize);
           odd++;
        }
     }
   };

   Board.DARK_SQUARE_COLOR = '#666';
   Board.LIGHT_SQUARE_COLOR = '#ccc';

   Board.prototype.squareSize = null;

   Board.prototype.canvasH = 500;
   Board.prototype.canvasW = 500;

   Board.prototype.ctx = null;

   C.Board = Board;

})();