/*
   Responds with a chess move when required along with a positions object containing the men by coordinate.
   Exposes things that UIs may want to use.
 */


//(function(){

   'use strict';

   function Engine(){
      this.buildPositions();
   }

   Engine.prototype.positions = {};


   Engine.prototype.initialiseEvents = function() {
      this.on(UI.MOVE_ATTEMPTED, this.checkMoveLegal);
      this.on(UI.MOVE_MADE, this.recieveMove)
   };

   Engine.prototype.checkMoveLegal = function(move) {
//      if (move == legal) {
//         this.fire(LEGAL_MOVE_MADE, move)
//      }
   };

   Engine.prototype.recieveMove = function(move) {
//      this.positions.pushMoveIntoPositions();
//      this.fire(POSITIONS_UPDATED);
//      this.calculateNextMove();
   };

   Engine.prototype.calculateNextMove = function(){
//      var move = "Nf3g3";
//      this.positions.pushMoveIntoPositions(move);
//      this.fire(Engine.POSITIONS_UPDATED, move, positions);
   };

   Engine.prototype.buildPositions = function(){
      var piece;

      for (var i=0; i<Engine.SQUARES_PER_ROW; i++) {
         for (var x=0; x<Engine.SQUARES_PER_ROW; x++) {
            this.positions[Engine.ALPHABET[x] + (Engine.SQUARES_PER_ROW-i)] = {}
         }
      }

      for (var i=0; i<Engine.SQUARES_PER_ROW; i++) {
         piece = Engine.pieces.white.pawn;
         this.positions[Engine.ALPHABET[i]+2] = piece;
         piece = Engine.pieces.black.pawn;
         this.positions[Engine.ALPHABET[i]+(Engine.SQUARES_PER_ROW-1)] = piece;
         piece = Engine.pieces.white[Engine.PIECE_ORDER[i]];
         this.positions[Engine.ALPHABET[i] + 1] = piece;
         piece = Engine.pieces.black[Engine.PIECE_ORDER[i]];
         this.positions[Engine.ALPHABET[i] + Engine.SQUARES_PER_ROW] = piece;
      }
   };

   Engine.ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

   Engine.PIECE_ORDER = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

   Engine.SQUARES_PER_ROW = 8;

   Engine.pieces = {
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

   C.Engine = Engine;

//})();