(function(){

   'use strict';

   function Queen(colour){
      this.colour = colour;
      Queen.superclass.constructor.apply(this, arguments);
   }
   C.extend(Queen, C.Piece);

   Queen.prototype.colour = null;

   Queen.prototype.canMoveForwards = true;

   Queen.prototype.canMoveBackwards = true;

   Queen.prototype.BLACK_UNICODE = '\u265B';

   Queen.prototype.WHITE_UNICODE = '\u2655';

   C.Queen = Queen;

})();