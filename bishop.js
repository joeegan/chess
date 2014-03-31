//(function(){

'use strict';

function Bishop(colour){
   this.colour = colour;
}

Bishop.prototype.colour = null;

Bishop.canMoveForwards = true;

Bishop.canMoveBackwards = false;

Bishop.unicode = '\u2659';

C.Bishop = Bishop;

//})();