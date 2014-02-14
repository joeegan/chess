// (function(){
function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

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
      squares.forEach(function(square) {
         if (y > square.top && y < square.top + square.height && x > square.left && x < square.left + square.width) {
            console.log('clicked on '+ square.name);
         }
      });

   }, false);

   this.canvas.addEventListener('mousemove', throttle(function(event) {
      var x = event.pageX - elemLeft,
          y = event.pageY - elemTop,
	  pieceName;
      squares.forEach(function(square) {
         if (y > square.top && y < square.top + square.height && x > square.left && x < square.left + square.width) {
            pieceName = this.positions[square.name].name;
            console.log('hovered on '+ square.name, pieceName);
         }
      }.bind(this));

   }.bind(this), false), 500);

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
   var piece;
   for (var i=0; i<Board.SQUARES_PER_ROW; i++) {
      piece = Board.pieces.white.pawn;
      this.place(piece.unicode, Board.ALPHABET[i]+2, piece.name);
      this.place(piece.unicode, Board.ALPHABET[i]+(Board.SQUARES_PER_ROW-1), piece.name);
   }
   for (var i=0; i<Board.PIECE_ORDER.length; i++) {
      piece = Board.pieces.white[Board.PIECE_ORDER[i]];
      this.place(piece.unicode, Board.ALPHABET[i] + 1, piece.name);
      piece = Board.pieces.black[Board.PIECE_ORDER[i]];
      this.place(piece.unicode, Board.ALPHABET[i] + Board.SQUARES_PER_ROW, piece.name);
   }
};

Board.prototype.place = function(piece, coords, pieceName) {
   this.ctx.fillStyle = "blue";
   this.ctx.font = "bold 54px Arial";
   this.ctx.fillText(piece, this.positions[coords].x + 4, this.positions[coords].y + 48);
   this.positions[coords].name = pieceName;
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
         this.positions[Board.ALPHABET[x] + (Board.SQUARES_PER_ROW-y)] = { x: x*this.squareSize, y: y*this.squareSize };
      }
   }
};

Board.prototype.squareColorResolver = function(x, y){
   if ((x+y) & 1) {
      return Board.DARK_SQUARE_COLOR;
   } else {
      return Board.LIGHT_SQUARE_COLOR;
   }
};

Board.ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
Board.PIECE_ORDER = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

Board.pieces = {
   black: {
      pawn: {unicode: '\u265F', name: "black.pawn"},
      rook: {unicode: '\u265C', name: "black.rook"},
      knight: {unicode: '\u265E', name: "black.knight"},
      bishop: {unicode: '\u265D',name: "black.bishop"},
      queen: {unicode: '\u265B', name: "black.queen"},
      king: {unicode: '\u265A', name: "black.king"}
   },
   white: {
      pawn: {unicode: '\u2659', name: "white.pawn"},
      rook: {unicode: '\u2656', name: "white.rook"},
      knight: {unicode: '\u2658', name: "white.knight"},
      bishop: {unicode: '\u2657',name: "white.bishop"},
      queen: {unicode: '\u2655', name: "white.queen"},
      king: {unicode: '\u2654', name: "white.king"}
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
