(function(){

   // Consider piece factory, rather than seperate pieces

   'use strict';

   function Piece(colour){
      this.colour = colour;
      this.unicode = (colour == "black" ? this.BLACK_UNICODE : this.WHITE_UNICODE);
   }

   Piece.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = this._processMoveData(selectedCoord, newCoord, turn, positions);
      return (this.movedBackwards(moveData)     && this.canMoveBackwards
              || this.movedForwards(moveData)   && this.canMoveForwards   && this.clearRouteForwards(moveData)
              || this.movedDiagonally(moveData) && this.canMoveDiagonally
      );
   };

   Piece.prototype.clearRouteForwards = function(moveData) {
      var clearRoute = true;
      if (moveData.turn == 'white') {
         for (var i = moveData.selectedCoordRow + 1; i < moveData.newCoordRow; i++) {
            if (moveData.positions[moveData.selectedCoordFile + i] instanceof Piece) {
               clearRoute = false;
               console.log('there was a blockage', moveData.selectedCoordFile + i, moveData.positions[moveData.selectedCoordFile + i]);
               break;
            }
         }
      }
      if (moveData.turn == 'black') {
         for (var i = moveData.selectedCoordRow - 1; i > moveData.newCoordRow; i--) {
            if (moveData.positions[moveData.selectedCoordFile + i] instanceof Piece) {
               clearRoute = false;
               console.log('there was a blockage', moveData.selectedCoordFile + i, moveData.positions[moveData.selectedCoordFile + i]);
               break;
            }
         }
      }

      console.log('clear route forwards', clearRoute);

      return clearRoute;
   };


   Piece.prototype._processMoveData = function(selectedCoord, newCoord, turn, positions){
     return {
         selectedCoord: selectedCoord,
         newCoord: newCoord,
         selectedCoordRow: +selectedCoord.slice(1),
         selectedCoordFile: selectedCoord.slice(0,1),
         newCoordFile: newCoord.slice(0,1),
         newCoordRow: +newCoord.slice(1),
         turn: turn,
         positions: positions
     }  
   };

   Piece.prototype.movedBackwards = function(moveData) {
      if ((moveData.turn == 'white'
           && moveData.newCoordRow < moveData.selectedCoordRow
           && moveData.newCoordFile == moveData.selectedCoordFile)
      || (moveData.turn == 'black'
          && moveData.newCoordRow > moveData.selectedCoordRow
          && moveData.newCoordFile == moveData.selectedCoordFile)) {
         console.log('move was backwards');
         return true;
      }
      return false;
   };

   Piece.prototype.movedForwards = function(moveData) {
      if ((moveData.turn == 'white'
         && moveData.newCoordRow > moveData.selectedCoordRow
         && moveData.newCoordFile == moveData.selectedCoordFile)
         || (moveData.turn == 'black'
         && moveData.newCoordRow < moveData.selectedCoordRow
         && moveData.newCoordFile == moveData.selectedCoordFile)) {
         console.log('move was forwards');
         return true;
      }
      return false;
   };

   Piece.prototype.movedMultiMove = function(moveData) {
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

   Piece.prototype.movedDiagonally = function(moveData) {
      var ALPHABET = C.Engine.ALPHABET;
      var coordFileDifference = Math.abs(ALPHABET.indexOf(moveData.selectedCoordFile) - ALPHABET.indexOf(moveData.newCoordFile));
      var coordRowDifference = Math.abs(moveData.selectedCoordRow - moveData.newCoordRow);
      if (coordFileDifference == coordRowDifference) {
         console.log('diagonal move attempted');
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

   Piece.prototype.canMoveDiagonally = true;

   Piece.prototype.canMoveBackwards = true;

   Piece.prototype.BLACK_UNICODE = null;

   Piece.prototype.WHITE_UNICODE = null;

   C.Piece = Piece;

})();