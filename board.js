// (function(){

function Board(canvasId){
   this.canvas = document.getElementById(canvasId);
   this.ctx = this.canvas.getContext('2d');
   return this;
}

Board.prototype.initialiseEvents = function(){
   this.addClickHandlersToSquares();
};

Board.prototype.addClickHandlersToSquares = function(){
   var elemLeft = this.canvas.offsetLeft,
      elemTop = this.canvas.offsetTop,
      squares = [];

   this.canvas.addEventListener('click', function(event) {
      var x = event.pageX - elemLeft,
          y = event.pageY - elemTop;
      console.log(x, y);
      squares.forEach(function(square) {
         if (y > square.top && y < square.top + square.height && x > square.left && x < square.left + square.width) {
            console.log('clicked on '+ square.name);
         }
      });

   }, false);

   for (var pos in this.positions) {
      squares.push({
         name: pos,
         width: this.squareSize,
         height: this.squareSize,
         top: this.positions[pos].y,
         left: this.positions[pos].x
      });
   }

};


Board.prototype.drawBoard = function(){
   this.drawSquares();
   this.drawBoardEdge();
   this.placePiecesOnBoard();
   this.initialiseEvents();
   return this;
};

Board.prototype.drawBoardEdge = function(){
   this.ctx.lineWidth   = 1;
   this.ctx.strokeRect(0,  0, this.canvasW, this.canvasH);
};

Board.prototype.placePiecesOnBoard = function(){
   this.placePawns();
};

Board.prototype.placePawns = function(){
   var pos;
   for (var i=0; i<Board.SQUARES_PER_ROW; i++) {
      pos = this.positions[Board.ALPHABET[i]+2];
      this.place(Board.pieces.white.pawn, pos);
      pos = this.positions[Board.ALPHABET[i]+(Board.SQUARES_PER_ROW-1)];
      this.place(Board.pieces.black.pawn, pos);
   }
   for (var i=0; i<Board.PIECE_ORDER.length; i++) {
      this.place(Board.pieces.white[Board.PIECE_ORDER[i]], this.positions[Board.ALPHABET[i] + 1]);
      this.place(Board.pieces.black[Board.PIECE_ORDER[i]], this.positions[Board.ALPHABET[i] + Board.SQUARES_PER_ROW]);
   }
};

Board.prototype.place = function(piece, pos) {
   this.ctx.fillStyle = "blue";
   this.ctx.font = "bold 54px Arial";
   this.ctx.fillText(piece, pos.x + 4, pos.y + 48);
};


Board.prototype.positions = {};

Board.prototype.drawSquares = function(){
   this.squareSize = this.canvasW/Board.SQUARES_PER_ROW;
   for (var y=0; y<Board.SQUARES_PER_ROW; y++) {
      for (var x=0; x<Board.SQUARES_PER_ROW; x++) {
         this.ctx.fillStyle = this.squareColorResolver(x, y);
         this.ctx.lineWidth = 1;
         this.ctx.fillRect(x*this.squareSize, y*this.squareSize, this.squareSize , this.squareSize);
         this.ctx.strokeStyle = '#fff';
         this.ctx.strokeRect(x*this.squareSize, y*this.squareSize, this.squareSize , this.squareSize);
         this.positions[Board.ALPHABET[x] + (Board.SQUARES_PER_ROW-y)] = { x: x*this.squareSize, y: y*this.squareSize};
      }
   }
};

Board.prototype.squareColorResolver = function(x, y){
   if (y % 2 == 0 && x % 2 !== 0
      || y % 2 !== 0 && x % 2 == 0) {
      return Board.DARK_SQUARE_COLOR;
   } else {
      return Board.LIGHT_SQUARE_COLOR;
   }
};

Board.ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
Board.PIECE_ORDER = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

Board.pieces = {
   black: {
      pawn: '\u265F',
      rook: '\u265C',
      knight: '\u265E',
      bishop: '\u265D',
      queen: '\u265B',
      king: '\u265A'
   },
   white: {
      pawn: '\u2659',
      rook: '\u2656',
      knight: '\u2658',
      bishop: '\u2657',
      queen: '\u2655',
      king: '\u2654'
   }
};

Board.DARK_SQUARE_COLOR = 'rgb(16, 240, 224)';
Board.LIGHT_SQUARE_COLOR = 'rgb(144, 240, 224)';
Board.SQUARES_PER_ROW = 8;

Board.prototype.squareSize = null;

Board.prototype.canvasH = 500;
Board.prototype.canvasW = 500;

Board.prototype.ctx = null;

Chess.Board = Board;

// })();