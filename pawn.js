//(function(){

'use strict';

function Pawn(colour){
   this.colour = colour;
   Pawn.superclass.constructor.apply(this, arguments);
}
C.extend(Pawn, C.Piece);

Pawn.BLACK_UNICODE = '\u265F';

Pawn.WHITE_UNICODE = '\u2659';

C.Pawn = Pawn;

//})();