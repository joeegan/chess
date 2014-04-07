(function(){

   // Consider piece factory, rather than seperate pieces

   'use strict';

   function Piece(colour){
      this.colour = colour;
      this.unicode = (colour == "black" ? this.BLACK_UNICODE : this.WHITE_UNICODE);
   }

   Piece.prototype.checkLegal = function(selectedCoord, newCoord, turn) {
      var selectedCoordFile = selectedCoord.slice(0,1);
      var selectedCoordRow = +selectedCoord.slice(1);
      var newCoordFile = newCoord.slice(0,1);
      var newCoordRow = +newCoord.slice(1);
      // block moving backwards
      if (!this.canMoveBackwards && turn == 'white' && newCoordRow < selectedCoordRow
         || !this.canMoveBackwards && turn == 'black' && newCoordRow > selectedCoordRow) {
         return false;
      }
      return true
   };

   Piece.prototype.colour = null;

   Piece.prototype.canMoveForwards = true;

   Piece.prototype.canMoveBackwards = false;

   Piece.prototype.BLACK_UNICODE = null;

   Piece.prototype.WHITE_UNICODE = null;

   C.Piece = Piece;

})();