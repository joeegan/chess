(function(){

   'use strict';

   function Queen(){
      Queen.superclass.constructor.apply(this, arguments);
   }
   C.extend(Queen, C.Piece);

   Queen.prototype.colour = null;

   Queen.prototype.BLACK_UNICODE = '\u265B';

   Queen.prototype.WHITE_UNICODE = '\u2655';

   Queen.prototype.notation = 'Q';

   C.Queen = Queen;

})();