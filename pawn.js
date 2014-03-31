//(function(){

'use strict';

function Pawn(colour){
   this.colour = colour;
}

Pawn.prototype.colour = null;

Pawn.canMoveForwards = true;

Pawn.canMoveBackwards = false;

Pawn.unicode = '\u2659';

C.Pawn = Pawn;

//})();