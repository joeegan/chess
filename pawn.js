(function(){

   'use strict';

   function Pawn(colour){
      this.colour = colour;
      Pawn.superclass.constructor.apply(this, arguments);
   }
   C.extend(Pawn, C.Piece);

   Pawn.prototype.movedMultiMove = function(moveData) {
      // Pawns multimove exception is white row 2 - 4, black row 7 - 5.
      if (moveData.turn == 'white'
          && moveData.selectedCoordRow == 2
          && moveData.newCoordRow == 4
          && moveData.selectedCoordFile == moveData.newCoordFile) {
         return false;
      } else if (moveData.turn == 'black'
         && moveData.selectedCoordRow == 7
         && moveData.newCoordRow == 5
         && moveData.selectedCoordFile == moveData.newCoordFile) {
         return false;
      } else {
         return Pawn.superclass.movedMultiMove.call(this, moveData);
      }
   };

   Pawn.prototype.movedDiagonally = function(moveData) {
      // Pawns are allowed to move diagonally one square forward when there is a piece in that coord.
      var ALPHABET = C.Engine.ALPHABET;
      var coordFileDifference = Math.abs(ALPHABET.indexOf(moveData.selectedCoordFile) - ALPHABET.indexOf(moveData.newCoordFile));
      var coordRowDifference = Math.abs(moveData.selectedCoordRow - moveData.newCoordRow);
      if (coordFileDifference == 1
          && coordRowDifference == 1
          && moveData.positions[moveData.newCoord] instanceof C.Piece) {
         return false;
      } else {
         return Pawn.superclass.movedDiagonally.call(this, moveData);
      }
   };

   Pawn.prototype.canMultiMove = false;

   Pawn.prototype.canMoveSideways = false;

   Pawn.prototype.canMoveBackwards = false;

   Pawn.prototype.canMoveDiagonally = false;

   Pawn.prototype.BLACK_UNICODE = '\u265F';

   Pawn.prototype.WHITE_UNICODE = '\u2659';

   C.Pawn = Pawn;

})();