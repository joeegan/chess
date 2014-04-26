(function(){

   'use strict';

   function Bishop(){
      Bishop.superclass.constructor.apply(this, arguments);
   }
   C.extend(Bishop, C.Piece);

   Bishop.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = C.Piece.processMoveData(selectedCoord, newCoord, turn, positions);
      return C.Piece.movedDiagonally(moveData) && C.Piece.clearRouteDiagonally(moveData);
   };

   Bishop.prototype.BLACK_UNICODE = '\u265D';

   Bishop.prototype.WHITE_UNICODE = '\u2657';

   Bishop.prototype.notation = 'B';

   C.Bishop = Bishop;

})();