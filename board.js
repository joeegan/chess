//(function(){

   'use strict';

   function Board(canvasId){
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      return this;
   }

   Board.prototype.selectedSquare = {pieceName:null};

   Board.prototype.selectedPiece = null;

   Board.prototype.positions = {};

   Board.prototype.handleBoardClick = function(ev){
      var mouseX = ev.pageX - this.canvas.offsetLeft,
          mouseY = ev.pageY - this.canvas.offsetTop,
          square, pieceName, squareName, piece;
      if (this.selectedPiece) {
         for (squareName in this.positions) {
            square = this.positions[squareName];
            pieceName = square.pieceName;
            if (this.withinSquare(mouseX, mouseY, square)) {
               console.log('clicked on '+ squareName);
               this.toggleSquareColour(this.selectedSquare.coord != squareName, squareName, square, this.selectedPiece);
               this.selectedSquare = null;
            }
         }
      } else {
         for (squareName in this.positions) {
            square = this.positions[squareName];
            pieceName = square.pieceName;
            if (this.withinSquare(mouseX, mouseY, square) && pieceName) {
               piece = this.getPieceByPieceName.call(this,pieceName);
               console.log('clicked on '+ squareName, pieceName);
               this.toggleSquareColour(this.selectedSquare.coord != squareName, squareName, square, piece);
               this.selectedSquare = square;
               this.selectedPiece = piece;
            }
         }
      }
   };

   Board.prototype.toggleSquareColour = function(bool, squareName, square, piece) {
      this.highlightSquare(false, this.selectedSquare);
      this.place(this.selectedSquare.unicode, this.selectedSquare.coord, this.selectedSquare.pieceName);

      this.highlightSquare(bool, square);
      this.place(piece.unicode, squareName, piece.pieceName);
   };

   Board.prototype.highlightSquare = function(bool, square){
      this.ctx.fillStyle = bool ? Board.SELECTED_SQUARE_COLOR : square.colour;
      this.ctx.fillRect(square.x, square.y, this.squareSize , this.squareSize);
   };

   Board.prototype.drawBoard = function(){
      this.drawSquares();
      this.drawBoardEdge();
      this.placePiecesOnBoard();
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
         this.place(piece.unicode, Board.ALPHABET[i]+2, piece.pieceName);
         piece = Board.pieces.black.pawn;
         this.place(piece.unicode, Board.ALPHABET[i]+(Board.SQUARES_PER_ROW-1), piece.pieceName);
      }
      for (var i = 0; i < Board.PIECE_ORDER.length; i++) {
         piece = Board.pieces.white[Board.PIECE_ORDER[i]];
         this.place(piece.unicode, Board.ALPHABET[i] + 1, piece.pieceName);
         piece = Board.pieces.black[Board.PIECE_ORDER[i]];
         this.place(piece.unicode, Board.ALPHABET[i] + Board.SQUARES_PER_ROW, piece.pieceName);
      }
   };

   Board.prototype.getPieceByPieceName = function(pieceName){
      return Board.pieces[pieceName.split('.')[0]][pieceName.split('.')[1]];
   };

   Board.prototype.withinSquare = function(x, y, square){
      return y > square.y
         && y < square.y + this.squareSize
         && x > square.x
         && x < square.x + this.squareSize;
   };

   Board.prototype.place = function(unicode, coords, pieceName) {
      if (coords) {
         this.ctx.fillStyle = Board.MEN_STROKE_COLOUR;
         this.ctx.font = Board.MEN_FONT;
         this.ctx.fillText(unicode, this.positions[coords].x + 4, this.positions[coords].y + 48);
         this.positions[coords].pieceName = pieceName;
         this.positions[coords].unicode = unicode;
         this.positions[coords].coord = coords;
      }
   };

   Board.prototype.drawSquares = function(){
      var colour;
      this.squareSize = this.canvasW/Board.SQUARES_PER_ROW;
      for (var y=0; y<Board.SQUARES_PER_ROW; y++) {
         for (var x=0; x<Board.SQUARES_PER_ROW; x++) {
            colour = this.squareColorResolver(x, y);
            this.ctx.fillStyle = colour;
            this.ctx.lineWidth = 1;
            this.ctx.fillRect(x*this.squareSize, y*this.squareSize, this.squareSize , this.squareSize);
            this.ctx.strokeStyle = '#fff';
            this.ctx.strokeRect(x*this.squareSize, y*this.squareSize, this.squareSize , this.squareSize);
            this.positions[Board.ALPHABET[x] + (Board.SQUARES_PER_ROW-y)] = {
               x: x*this.squareSize,
               y: y*this.squareSize,
               colour: colour
            };
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
         pawn: {unicode: '\u265F', pieceName: "black.pawn"},
         rook: {unicode: '\u265C', pieceName: "black.rook"},
         knight: {unicode: '\u265E', pieceName: "black.knight"},
         bishop: {unicode: '\u265D',pieceName: "black.bishop"},
         queen: {unicode: '\u265B', pieceName: "black.queen"},
         king: {unicode: '\u265A', pieceName: "black.king"}
      },
      white: {
         pawn: {unicode: '\u2659', pieceName: "white.pawn"},
         rook: {unicode: '\u2656', pieceName: "white.rook"},
         knight: {unicode: '\u2658', pieceName: "white.knight"},
         bishop: {unicode: '\u2657',pieceName: "white.bishop"},
         queen: {unicode: '\u2655', pieceName: "white.queen"},
         king: {unicode: '\u2654', pieceName: "white.king"}
      }
   };

   Board.DARK_SQUARE_COLOR = '#B58863';

   Board.LIGHT_SQUARE_COLOR = '#F0D9B5';

   Board.SELECTED_SQUARE_COLOR = '#FFF55C';

   Board.MEN_STROKE_COLOUR = '#000';

   Board.MEN_FONT = 'bold 54px Arial';

   Board.SQUARES_PER_ROW = 8;

   Board.prototype.squareSize = null;

   Board.prototype.canvasH = 500;

   Board.prototype.canvasW = 500;

   Board.prototype.ctx = null;

   C.Board = Board;

//})();
