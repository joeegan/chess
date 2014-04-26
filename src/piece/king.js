(function(){

   'use strict';

   function King(){
      King.superclass.constructor.apply(this, arguments);
   }
   C.extend(King, C.Piece);

   King.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = C.Piece.processMoveData(selectedCoord, newCoord, turn, positions);
      var ALPHABET = C.Engine.ALPHABET;
      var coordFileDifference = Math.abs(ALPHABET.indexOf(moveData.selectedCoordFile) - ALPHABET.indexOf(moveData.newCoordFile));
      var coordRankDifference = Math.abs(moveData.selectedCoordRank - moveData.newCoordRank);
      return (coordFileDifference <= 1 && coordRankDifference <= 1);
   };

   King.prototype.BLACK_UNICODE = '\u265A';

   King.prototype.WHITE_UNICODE = '\u2654';

   King.prototype.notation = 'K';

   C.King = King;

})();