(function(){

   'use strict';

   function Bishop(){
      Bishop.superclass.constructor.apply(this, arguments);
   }
   C.extend(Bishop, C.Piece);

   Bishop.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = this._processMoveData(selectedCoord, newCoord, turn, positions);
      return this.movedDiagonally(moveData) && this.clearRouteDiagonally(moveData);
   };

   Bishop.prototype.BLACK_UNICODE = '\u265D';

   Bishop.prototype.WHITE_UNICODE = '\u2657';

   C.Bishop = Bishop;

})();