(function(){

   'use strict';

   function King(colour){
      this.colour = colour;
      King.superclass.constructor.apply(this, arguments);
   }
   C.extend(King, C.Piece);

   King.prototype.canMultiMove = false;

   King.prototype.BLACK_UNICODE = '\u265A';

   King.prototype.WHITE_UNICODE = '\u2654';

   C.King = King;

})();