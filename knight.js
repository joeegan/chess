(function(){

'use strict';

function Knight(colour){
   this.colour = colour;
   Knight.superclass.constructor.apply(this, arguments);
}
C.extend(Knight, C.Piece);

Knight.prototype.colour = null;

Knight.prototype.canMoveForwards = true;

Knight.prototype.canMoveBackwards = false;

Knight.prototype.BLACK_UNICODE = '\u265E';

Knight.prototype.WHITE_UNICODE = '\u2658';

C.Knight = Knight;

})();
