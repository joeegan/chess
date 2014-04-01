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
      var moveBreakdown = move.split(/-|x/);
      var isTake = moveBreakdown[1] == "x";
      var selectedCoord = moveBreakdown[0];
      var newCoord = moveBreakdown[1];
      if (this._checkLegal(selectedCoord, newCoord)) {
         if (isHuman) {
            this.place(selectedCoord, newCoord);
            this.fire(Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.positions);
         }
      } else if (isHuman) {
         this.fire(Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT, this.positions);
      }

   };

   Engine.prototype._checkLegal = function(selectedCoord, newCoord) {
      if (this.positions[newCoord].pieceName
         && (this.positions[selectedCoord].pieceName.split('.')[0]
          == this.positions[newCoord].pieceName.split('.')[0])) {
         console.log('can\'t take own piece');
         return false;
      }
      return true;
   };

   Engine.prototype.place = function(selectedCoord, newCoord){
      var pieceToMove = this.positions[selectedCoord];
      this.positions[newCoord].pieceName = pieceToMove.pieceName;
      this.positions[newCoord].unicode = pieceToMove.unicode;
      this.positions[selectedCoord].pieceName = null;
      this.positions[selectedCoord].unicode = null;
   };

   Engine.prototype.buildPositions = function(){
      var piece;

      for (var i = 0; i < Engine.SQUARES_PER_ROW; i++) {
         for (var x = 0; x < Engine.SQUARES_PER_ROW; x++) {
            this.positions[Engine.ALPHABET[x] + (Engine.SQUARES_PER_ROW-i)] = {}
         }
      }

      for (var i = 0; i < Engine.SQUARES_PER_ROW; i++) {
         this.positions[Engine.ALPHABET[i] + 2] = new C.Pawn('white');
         this.positions[Engine.ALPHABET[i] + (Engine.SQUARES_PER_ROW - 1)] = new C.Pawn('black');
         piece = new C[Engine.PIECE_ORDER[i]]('white');
         this.positions[Engine.ALPHABET[i] + 1] = piece;
         piece = new C[Engine.PIECE_ORDER[i]]('black');
         this.positions[Engine.ALPHABET[i] + Engine.SQUARES_PER_ROW] = piece;
      }
   };

   Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT = "humanMoveDeemedLegalEvent";

   Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT = "humanMoveDeemedIllegalEvent";

   Engine.ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

   Engine.PIECE_ORDER = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];

   Engine.SQUARES_PER_ROW = 8;

//   Engine.pieces = {
//      black: {
//         pawn: C.Pawn,
//         rook: {unicode: '\u265C', pieceName: "rook"},
//         knight: {unicode: '\u265E', pieceName: "knight"},
//         bishop: {unicode: '\u265D',pieceName: "bishop"},
//         queen: {unicode: '\u265B', pieceName: "black.queen"},
//         king: {unicode: '\u265A', pieceName: "black.king"}
//      },
//      white: {
//         pawn: C.Pawn,
//         rook: {unicode: '\u2656', pieceName: "white.rook"},
//         knight: {unicode: '\u2658', pieceName: "white.knight"},
//         bishop: {unicode: '\u2657',pieceName: "white.bishop"},
//         queen: {unicode: '\u2655', pieceName: "white.queen"},
//         king: {unicode: '\u2654', pieceName: "white.king"}
//      }
//   };

   C.Engine = Engine;

//})();