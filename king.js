//(function(){

'use strict';

function King(colour){
   this.colour = colour;
   King.constructor.apply(this, arguments);
}
King.prototype = Object.create(C.Piece.prototype);

King.BLACK_UNICODE = '\u265A';

King.WHITE_UNICODE = '\u2654';

C.King = King;

//})();