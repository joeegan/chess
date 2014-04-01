//(function(){

'use strict';

function Piece(colour){
   this.colour = colour;
   this.unicode = (colour == "black" ? this.BLACK_UNICODE : this.WHITE_UNICODE);
}

Piece.prototype.colour = null;

Piece.prototype.canMoveForwards = true;

Piece.prototype.canMoveBackwards = false;

Piece.prototype.BLACK_UNICODE = null;

Piece.prototype.WHITE_UNICODE = null;

C.Piece = Piece;

//})();