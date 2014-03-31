//(function(){

'use strict';

function Piece(colour){
   this.colour = colour;
   this.unicode = (colour == "black" ? this.BLACK_UNICODE : this.WHITE_UNICODE);
}

Piece.prototype.colour = null;

Piece.prototype.canMoveForwards = true;

Piece.prototype.canMoveBackwards = false;

Piece.prototype.BLACK_UNICODE = '\u265F';

Piece.prototype.WHITE_UNICODE = '\u2659';

C.Piece = Piece;

//})();