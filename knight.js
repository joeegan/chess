(function(){

   'use strict';

   function Knight(colour){
      this.colour = colour;
      Knight.superclass.constructor.apply(this, arguments);
   }
   C.extend(Knight, C.Piece);

   Knight.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = this._processMoveData(selectedCoord, newCoord, turn, positions);
      var ALPHABET = C.Engine.ALPHABET;
      var coordFileDifference = Math.abs(ALPHABET.indexOf(moveData.selectedCoordFile) - ALPHABET.indexOf(moveData.newCoordFile));
      var coordRowDifference = Math.abs(moveData.selectedCoordRow - moveData.newCoordRow);
      if (coordFileDifference == 1 && coordRowDifference == 2
          || coordFileDifference == 2 && coordRowDifference == 1) {
         console.log('you just moved like a pony');
         return true;
      }
      return false;
   };

   Knight.prototype.BLACK_UNICODE = '\u265E';

   Knight.prototype.WHITE_UNICODE = '\u2658';

   C.Knight = Knight;

})();
