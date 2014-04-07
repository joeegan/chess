(function(){

   'use strict';

   function Bishop(colour){
      this.colour = colour;
      Bishop.superclass.constructor.apply(this, arguments);
   }
   C.extend(Bishop, C.Piece);

   Bishop.prototype.colour = null;

   Bishop.prototype.canMoveForwards = false;

   Bishop.prototype.canMoveBackwards = false;

   Bishop.prototype.BLACK_UNICODE = '\u265D';

   Bishop.prototype.WHITE_UNICODE = '\u2657';

   C.Bishop = Bishop;

})();