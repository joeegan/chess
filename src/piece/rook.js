(function(){

   'use strict';

   function Rook(){
      Rook.superclass.constructor.apply(this, arguments);
   }
   C.extend(Rook, C.Piece);

   Rook.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = C.Piece.processMoveData(selectedCoord, newCoord, turn, positions);
      return (C.Piece.movedBackwards(moveData) || C.Piece.movedSideways(moveData) || C.Piece.movedForwards(moveData))
         && C.Piece.clearRouteStraight(moveData);
   };

   Rook.prototype.BLACK_UNICODE = '\u265C';

   Rook.prototype.WHITE_UNICODE = '\u2656';

   Rook.prototype.notation = 'R';

   C.Rook = Rook;

})();