(function(){

   // Consider piece factory, rather than seperate pieces

   'use strict';

   function Piece(colour){
      this.colour = colour;
      this.unicode = (colour == "black" ? this.BLACK_UNICODE : this.WHITE_UNICODE);
   }

   Piece.prototype.checkLegal = function(selectedCoord, newCoord, turn) {
      var moveData = this._processMoveData(selectedCoord, newCoord, turn);
      if ( (!this.canMoveBackwards && this.movedBackwards(moveData))
         || (!this.canMultiMove && this.movedMultiMove(moveData))
         || (!this.canMoveSideways && this.checkSideways(moveData))) {
         console.log('move was illegal');
         return false;
      }
      return true;
   };
   
   Piece.prototype._processMoveData = function(selectedCoord, newCoord, turn){
     return {
         selectedCoordRow: +selectedCoord.slice(1),
         selectedCoordFile: selectedCoord.slice(0,1),
         newCoordFile: newCoord.slice(0,1),
         newCoordRow: +newCoord.slice(1),
         turn: turn
     }  
   };

   Piece.prototype.movedBackwards = function(moveData) {
      if ((moveData.turn == 'white' && moveData.newCoordRow < moveData.selectedCoordRow)
      || (moveData.turn == 'black' && moveData.newCoordRow > moveData.selectedCoordRow)) {
         console.log('move was backwards');
         return true;
      }
      return false;
   };

   Piece.prototype.movedMultiMove = function(moveData) {
      // temp, think of some OO way to reuse this...
      var ALPHABET = C.Engine.ALPHABET;
      var coordFileDifference = Math.abs(ALPHABET.indexOf(moveData.selectedCoordFile) - ALPHABET.indexOf(moveData.newCoordFile));
      var coordRowDifference = Math.abs(moveData.selectedCoordRow - moveData.newCoordRow);
      if (coordFileDifference > 1
         || coordRowDifference > 1) {
         console.log('can\'t multimove');
         return true;
      }
      return false;
   };

   Piece.prototype.checkSideways = function(moveData) {
      if (moveData.selectedCoordRow == moveData.newCoordRow) {
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