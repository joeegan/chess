(function(){

   // Consider piece factory, rather than seperate pieces

   'use strict';

   function Piece(colour){
      this.colour = colour;
      this.unicode = (colour == "black" ? this.BLACK_UNICODE : this.WHITE_UNICODE);
   }

   Piece.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = this._processMoveData(selectedCoord, newCoord, turn, positions);
      return (this.movedBackwards(moveData)
              || this.movedForwards(moveData)  && this.clearRouteForwards(moveData)
              || this.movedDiagonally(moveData) && this.clearRouteDiagonally(moveData)
              || this.movedSideways(moveData)
      );
   };

   Piece.prototype.clearRouteForwards = function(moveData) {
      var clearRoute = true;
      if (moveData.turn == 'white') {
         for (var i = moveData.selectedCoordRow + 1; i < moveData.newCoordRow; i++) {
            clearRoute = this.checkStraightRoute(moveData, i);
            if (!clearRoute) break;
         }
      }
      if (moveData.turn == 'black') {
         for (var i = moveData.selectedCoordRow - 1; i > moveData.newCoordRow; i--) {
            clearRoute = this.checkStraightRoute(moveData, i);
            if (!clearRoute) break;
         }
      }
      return clearRoute;
   };

   Piece.prototype.checkStraightRoute = function(moveData, i) {
      var clearRoute = true;
      if (moveData.positions[moveData.selectedCoordFile + i] instanceof Piece) {
         clearRoute = false;
         console.log('there was a blockage', moveData.selectedCoordFile + i, moveData.positions[moveData.selectedCoordFile + i]);
      }
      return clearRoute;
   };

   Piece.prototype.clearRouteDiagonally = function(moveData) {
      var clearRoute = true;
      var selectedFileIndex = C.Engine.ALPHABET.indexOf(moveData.selectedCoordFile);
      var newFileIndex = C.Engine.ALPHABET.indexOf(moveData.newCoordFile);
      var coordToCheck;
      var negativeFileIncrement = selectedFileIndex - 1;
      var positiveFileIncrement = selectedFileIndex + 1;
      var positiveRowIncrement = moveData.selectedCoordRow + 1;
      var negativeRowIncrement = moveData.selectedCoordRow - 1;
      var difference = selectedFileIndex > newFileIndex ? selectedFileIndex - newFileIndex : newFileIndex - selectedFileIndex;
      for (var i = 1; i < difference; i++) {
         clearRoute = false;
         if (newFileIndex > selectedFileIndex && moveData.newCoordRow > moveData.selectedCoordRow) {
            coordToCheck = C.Engine.ALPHABET[positiveFileIncrement]+positiveRowIncrement; // north east
         } else if (newFileIndex < selectedFileIndex && moveData.newCoordRow > moveData.selectedCoordRow) {
            coordToCheck = C.Engine.ALPHABET[negativeFileIncrement]+positiveRowIncrement; // north west
         } else if (newFileIndex > selectedFileIndex && moveData.newCoordRow < moveData.selectedCoordRow) {
            coordToCheck = C.Engine.ALPHABET[positiveFileIncrement]+negativeRowIncrement; // south east
         } else if (newFileIndex < selectedFileIndex && moveData.newCoordRow < moveData.selectedCoordRow) {
            coordToCheck = C.Engine.ALPHABET[negativeFileIncrement]+negativeRowIncrement; // south west
         }
         clearRoute = !(moveData.positions[coordToCheck] instanceof C.Piece);
         if (!clearRoute) {
            console.log('there was a blockage', coordToCheck, moveData.positions[coordToCheck]);
            break;
         }
         negativeFileIncrement--;
         positiveFileIncrement++;
         negativeRowIncrement--;
         positiveRowIncrement++;
      }
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

   Piece.prototype.movedSideways = function(moveData) {
      if (moveData.selectedCoordRow == moveData.newCoordRow) {
         return true;
      }
      return false;
   };

   Piece.prototype.colour = null;

   Piece.prototype.BLACK_UNICODE = null;

   Piece.prototype.WHITE_UNICODE = null;

   C.Piece = Piece;

})();