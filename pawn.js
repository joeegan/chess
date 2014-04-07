(function(){

'use strict';

   function Pawn(colour){
      this.colour = colour;
      Pawn.superclass.constructor.apply(this, arguments);
   }
   C.extend(Pawn, C.Piece);

   Pawn.prototype.multiMove = false;

   Pawn.prototype.canMoveSideways = false;

   Pawn.prototype.BLACK_UNICODE = '\u265F';

   Pawn.prototype.WHITE_UNICODE = '\u2659';

   C.Pawn = Pawn;

})();