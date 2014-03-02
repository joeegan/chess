//(function(){

   'use strict';

   function Board(canvasId){
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      return this;
   }

   Board.prototype.selectedSquare = null;

   Board.prototype.selectedPiece = null;

   Board.prototype.positions = {};

   Board.prototype.handleBoardClick = function(ev){
      var mouseX = ev.pageX - this.canvas.offsetLeft,
          mouseY = ev.pageY - this.canvas.offsetTop,
          square, pieceName, squareName, piece;
      for (squareName in Board.squares) {
         square = Board.squares[squareName];
         pieceName = this.getPieceNameFromSquareName.call(this, squareName);
         if (this.withinSquare(mouseX, mouseY, square) && pieceName) {
            piece = this.getPieceByPieceName.call(this,pieceName);
            console.log('clicked on '+ squareName, pieceName);
            this.selectedPiece = pieceName;
            this.selectedSquare = squareName;
            this.toggleSquareColour(true, squareName, square, piece);
         }
      }
   };

   Board.prototype.toggleSquareColour = function(bool, squareName, square, piece) {
      this.highlightSquare(bool, square);
      this.place(piece.unicode, squareName, piece.name);
   };

   Board.prototype.highlightSquare = function(bool, square){
      this.ctx.fillStyle = '#FFF55C';
      this.ctx.fillRect(square.left, square.top, this.squareSize , this.squareSize);
   };

   Board.prototype.drawBoard = function(){
      this.drawSquares();
      this.drawBoardEdge();
      this.placePiecesOnBoard();
      for (var pos in this.positions) {
         Board.squares[pos] = {
            top: this.positions[pos].y,
            left: this.positions[pos].x
         };
      }
      this.canvas.addEventListener('click', this.handleBoardClick.bind(this), false);
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
      var piece;
      for (var i = 0; i < Board.SQUARES_PER_ROW; i++) {
         piece = Board.pieces.white.pawn;
         this.place(piece.unicode, Board.ALPHABET[i]+2, piece.name);
         piece = Board.pieces.black.pawn;
         this.place(piece.unicode, Board.ALPHABET[i]+(Board.SQUARES_PER_ROW-1), piece.name);
      }
      for (var i = 0; i < Board.PIECE_ORDER.length; i++) {
         piece = Board.pieces.white[Board.PIECE_ORDER[i]];
         this.place(piece.unicode, Board.ALPHABET[i] + 1, piece.name);
         piece = Board.pieces.black[Board.PIECE_ORDER[i]];
         this.place(piece.unicode, Board.ALPHABET[i] + Board.SQUARES_PER_ROW, piece.name);
      }
   };

   Board.prototype.getPieceNameFromSquareName = function(squareName){
      return this.positions[squareName].name;
   };

   Board.prototype.getPieceByPieceName = function(pieceName){
      return Board.pieces[pieceName.split('.')[0]][pieceName.split('.')[1]];
   };

   Board.prototype.withinSquare = function(x, y, square){
      return y > square.top
         && y < square.top + this.squareSize
         && x > square.left
         && x < square.left + this.squareSize;
   };

   Board.prototype.place = function(pieceUnicode, coords, pieceName) {
      this.ctx.fillStyle = Board.MEN_STROKE_COLOUR;
      this.ctx.font = Board.MEN_FONT;
      this.ctx.fillText(pieceUnicode, this.positions[coords].x + 4, this.positions[coords].y + 48);
      this.positions[coords].name = pieceName;
   };

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

   Board.squares = {};
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

   Board.DARK_SQUARE_COLOR = '#B58863';

   Board.LIGHT_SQUARE_COLOR = '#F0D9B5';

   Board.MEN_STROKE_COLOUR = '#000';

   Board.MEN_FONT = 'bold 54px Arial';

   Board.SQUARES_PER_ROW = 8;

   Board.prototype.squareSize = null;

   Board.prototype.canvasH = 500;

   Board.prototype.canvasW = 500;

   Board.prototype.ctx = null;

   C.Board = Board;

//})();
