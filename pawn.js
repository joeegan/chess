(function(){

'use strict';

   function Pawn(colour){
      this.colour = colour;
      Pawn.superclass.constructor.apply(this, arguments);
   }
   C.extend(Pawn, C.Piece);

   Pawn.prototype.movedMultiMove = function(moveData) {
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

   Pawn.prototype.canMultiMove = false;

   Pawn.prototype.canMoveSideways = false;

   Pawn.prototype.canMoveBackwards = false;

   Pawn.prototype.BLACK_UNICODE = '\u265F';

   Pawn.prototype.WHITE_UNICODE = '\u2659';

   C.Pawn = Pawn;

})();