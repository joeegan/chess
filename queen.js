//(function(){

'use strict';

function Queen(colour){
   this.colour = colour;
}

Queen.prototype.colour = null;

Queen.canMoveForwards = true;

Queen.canMoveBackwards = true;

Queen.unicode = '\u2659';

C.Queen = Queen;

//})();