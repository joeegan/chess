/*
   Responds with a chess move when required along with a positions object containing the men by coordinate.
   Exposes things that UIs may want to use.
 */


//(function(){

   'use strict';

   function Engine(){
      this.buildPositions();
   }

   Engine.prototype = Object.create(Subscribable.prototype);

   Engine.prototype.positions = {};

   Engine.prototype.checkMoveLegal = function(move, isHuman) {
      this.place(move);
      if (isHuman) {
         this.fire(Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.positions);
      }
   };

   Engine.prototype.place = function(move){
      var moveBreakdown = move.split(/-|x/);
      var isTake = moveBreakdown[1] == "x";
      var selectedCoord = moveBreakdown[0];
      var newCoord = moveBreakdown[1];
      var pieceToMove = this.positions[selectedCoord];
      this.positions[newCoord].pieceName = pieceToMove.pieceName;
      this.positions[newCoord].unicode = pieceToMove.unicode;
      this.positions[selectedCoord].pieceName = null;
      this.positions[selectedCoord].unicode = null;
   };

   Engine.prototype.buildPositions = function(){
      var piece;

      for (var i=0; i<Engine.SQUARES_PER_ROW; i++) {
         for (var x=0; x<Engine.SQUARES_PER_ROW; x++) {
            this.positions[Engine.ALPHABET[x] + (Engine.SQUARES_PER_ROW-i)] = {}
         }
      }

      for (var i=0; i<Engine.SQUARES_PER_ROW; i++) {
         piece = Object.create(Engine.pieces.white.pawn);
         this.positions[Engine.ALPHABET[i]+2] = piece;
         piece = Object.create(Engine.pieces.black.pawn);
         this.positions[Engine.ALPHABET[i]+(Engine.SQUARES_PER_ROW-1)] = piece;
         piece = Object.create(Engine.pieces.white[Engine.PIECE_ORDER[i]]);
         this.positions[Engine.ALPHABET[i] + 1] = piece;
         piece = Object.create(Engine.pieces.black[Engine.PIECE_ORDER[i]]);
         this.positions[Engine.ALPHABET[i] + Engine.SQUARES_PER_ROW] = piece;
      }
   };

   Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT = "humanMoveDeemedLegalEvent";

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