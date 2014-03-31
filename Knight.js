//(function(){

'use strict';

function Knight(colour){
   this.colour = colour;
}

Knight.prototype.colour = null;

Knight.canMoveForwards = true;

Knight.canMoveBackwards = false;

Knight.unicode = '\u2659';

C.Knight = Knight;

//})();