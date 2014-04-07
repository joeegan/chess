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
      var turnWhite = turn == 'white';
      var turnBlack = turn == 'black';
      if ((!this.canMoveBackwards && turnWhite && newCoordRow < selectedCoordRow)
         || (!this.canMoveBackwards && turnBlack && newCoordRow > selectedCoordRow)
         || (!this.multiMove && !this.checkMultiMove(arguments))
         || (!this.canMoveSideways && !this.checkSideways(arguments))) {
         return false;
      }
      return true
   };

   Piece.prototype.checkMultiMove = function() {
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
         return false;
      }
      return true;
   };

   Piece.prototype.checkSideways = function() {
      var selectedCoordRow = +arguments[0][0].slice(1);
      var newCoordRow = +arguments[0][1].slice(1);
      if (selectedCoordRow == newCoordRow) {
         return false;
      }
      return true;
   };

   Piece.prototype.colour = null;

   Piece.prototype.canMoveForwards = true;

   Piece.prototype.canMoveSideways = true;

   Piece.prototype.multiMove = true;

   Piece.prototype.canMoveBackwards = false;

   Piece.prototype.BLACK_UNICODE = null;

   Piece.prototype.WHITE_UNICODE = null;

   C.Piece = Piece;

})();