'use strict';

function Rook(colour){
   this.colour = colour;
   Rook.superclass.constructor.apply(this, arguments);
}
C.extend(Rook, C.Piece);

Rook.prototype.BLACK_UNICODE = '\u265C';

Rook.prototype.WHITE_UNICODE = '\u2656';

C.Rook = Rook;