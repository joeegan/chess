(function(){

   'use strict';

   function King(colour){
      this.colour = colour;
      King.superclass.constructor.apply(this, arguments);
   }
   C.extend(King, C.Piece);

   King.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = this._processMoveData(selectedCoord, newCoord, turn, positions);
      var ALPHABET = C.Engine.ALPHABET;
      var coordFileDifference = Math.abs(ALPHABET.indexOf(moveData.selectedCoordFile) - ALPHABET.indexOf(moveData.newCoordFile));
      var coordRowDifference = Math.abs(moveData.selectedCoordRow - moveData.newCoordRow);
      if (coordFileDifference == 1 && coordRowDifference == 1) {
         return true;
      }
      return false;
   };

   King.prototype.BLACK_UNICODE = '\u265A';

   King.prototype.WHITE_UNICODE = '\u2654';

   C.King = King;

})();