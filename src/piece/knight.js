(function(){

   'use strict';

   function Knight(){
      Knight.superclass.constructor.apply(this, arguments);
   }
   C.extend(Knight, C.Piece);

   Knight.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = C.Piece.processMoveData(selectedCoord, newCoord, turn, positions);
      var ALPHABET = C.Engine.ALPHABET;
      var coordFileDifference = Math.abs(ALPHABET.indexOf(moveData.selectedCoordFile) - ALPHABET.indexOf(moveData.newCoordFile));
      var coordRankDifference = Math.abs(moveData.selectedCoordRank - moveData.newCoordRank);
      if (coordFileDifference == 1 && coordRankDifference == 2
          || coordFileDifference == 2 && coordRankDifference == 1) {
         return true;
      }
      return false;
   };

   Knight.prototype.BLACK_UNICODE = '\u265E';

   Knight.prototype.WHITE_UNICODE = '\u2658';

   Knight.prototype.notation = 'N';

   C.Knight = Knight;

})();
