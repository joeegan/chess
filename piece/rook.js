(function(){

   'use strict';

   function Rook(){
      Rook.superclass.constructor.apply(this, arguments);
   }
   C.extend(Rook, C.Piece);

   Rook.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = this._processMoveData(selectedCoord, newCoord, turn, positions);
      return (this.movedBackwards(moveData) || this.movedSideways(moveData) || this.movedForwards(moveData))
         && this.clearRouteStraight(moveData);
   };

   Rook.prototype.BLACK_UNICODE = '\u265C';

   Rook.prototype.WHITE_UNICODE = '\u2656';

   C.Rook = Rook;

})();