(function(){

   // Consider piece factory, rather than seperate pieces

   'use strict';

   function Piece(colour){
      this.colour = colour;
      this.unicode = (colour == "black" ? this.BLACK_UNICODE : this.WHITE_UNICODE);
   }

   Piece.prototype.checkLegal = function(selectedCoord, newCoord, turn) {
      if ( (!this.canMoveBackwards && this.movedBackwards(arguments))
         || (!this.canMultiMove && this.movedMultiMove(arguments))
         || (!this.canMoveSideways && this.checkSideways(arguments))) {
         console.log('move was illegal');
         return false;
      }
      return true;
   };

   Piece.prototype.movedBackwards = function() {
      var selectedCoordRow = +arguments[0][0].slice(1);
      var newCoordRow = +arguments[0][1].slice(1);
      var turn = arguments[0][2];
      if ((turn == 'white' && newCoordRow < selectedCoordRow)
      || (turn == 'black' && newCoordRow > selectedCoordRow)) {
         console.log('move was backwards');
         return true;
      }
      return false;
   };

   Piece.prototype.movedMultiMove = function() {
      // temp, think of some OO way to reuse this...
      var selectedCoordFile = arguments[0][0].slice(0,1);
      var selectedCoordRow = +arguments[0][0].slice(1);
      var newCoordFile = arguments[0][1].slice(0,1);
      var newCoordRow = +arguments[0][1].slice(1);
      var ALPHABET = C.Engine.ALPHABET;
      var coordFileDifference = Math.abs(ALPHABET.indexOf(selectedCoordFile) - ALPHABET.indexOf(newCoordFile));
      var coordRowDifference = Math.abs(selectedCoordRow - newCoordRow);
      if (coordFileDifference > 1
         || coordRowDifference > 1) {
         console.log('can\'t multimove');
         return true;
      }
      return false;
   };

   Piece.prototype.checkSideways = function() {
      var selectedCoordRow = +arguments[0][0].slice(1);
      var newCoordRow = +arguments[0][1].slice(1);
      if (selectedCoordRow == newCoordRow) {
         console.log('can\'t move sideways');
         return true;
      }
      return false;
   };

   Piece.prototype.colour = null;

   Piece.prototype.canMoveForwards = true;

   Piece.prototype.canMoveSideways = true;

   /**
    * Can move more than one space in any direction
    * @type {boolean}
    */
   Piece.prototype.canMultiMove = true;

   Piece.prototype.canMoveBackwards = true;

   Piece.prototype.BLACK_UNICODE = null;

   Piece.prototype.WHITE_UNICODE = null;

   C.Piece = Piece;

})();