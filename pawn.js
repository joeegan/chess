(function(){

   'use strict';

   function Pawn(colour){
      this.colour = colour;
      Pawn.superclass.constructor.apply(this, arguments);
   }
   C.extend(Pawn, C.Piece);

   Pawn.prototype.movedForwards = function(moveData) {
      // Pawns multimove exception is white row 2 - 4, black row 7 - 5.
      if (moveData.turn == 'white'
          && moveData.selectedCoordRow == 2
          && moveData.newCoordRow == 4
          && moveData.selectedCoordFile == moveData.newCoordFile) {
         console.log('took initial pawn two-coord leap');
         return true;
      } else if (moveData.turn == 'black'
         && moveData.selectedCoordRow == 7
         && moveData.newCoordRow == 5
         && moveData.selectedCoordFile == moveData.newCoordFile) {
         console.log('took initial pawn two-coord leap');
         return true;
      } else if (moveData.turn == 'white'
         && moveData.newCoordRow - moveData.selectedCoordRow == 1
         && moveData.selectedCoordFile == moveData.newCoordFile) {
         return true;
      } else if (moveData.turn == 'black'
         && moveData.selectedCoordRow - moveData.newCoordRow == 1
         && moveData.selectedCoordFile == moveData.newCoordFile) {
         return true;
      } else {
         return false;
      }
   };

   Pawn.prototype.movedDiagonally = function(moveData) {
      // Pawns are allowed to move diagonally one square forward when there is a piece in that coord.
      var ALPHABET = C.Engine.ALPHABET;
      var coordFileDifference = Math.abs(ALPHABET.indexOf(moveData.selectedCoordFile) - ALPHABET.indexOf(moveData.newCoordFile));
      var coordRowDifference = Math.abs(moveData.selectedCoordRow - moveData.newCoordRow);
      var moveWasForward;
      if (moveData.turn == 'white') {
         moveWasForward = moveData.newCoordRow > moveData.selectedCoordRow;
      } else {
         moveWasForward = moveData.newCoordRow < moveData.selectedCoordRow;
      }
      if (coordFileDifference == 1
          && coordRowDifference == 1
          && moveWasForward
          && moveData.positions[moveData.newCoord] instanceof C.Piece) {
         return true;
      } else {
         return false;
      }
   };

   Pawn.prototype.canMoveSideways = false;

   Pawn.prototype.canMoveBackwards = false;

   Pawn.prototype.canMoveDiagonally = true;

   Pawn.prototype.BLACK_UNICODE = '\u265F';

   Pawn.prototype.WHITE_UNICODE = '\u2659';

   C.Pawn = Pawn;

})();