//(function(){

'use strict';

function King(colour){
   this.colour = colour;
}

King.prototype.colour = null;

King.canMoveForwards = true;

King.canMoveBackwards = false;

King.unicode = '\u2659';

C.King = King;

//})();