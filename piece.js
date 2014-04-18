(function(){

   // Consider piece factory, rather than separate pieces

   'use strict';

   function Piece(colour){
      this.colour = colour;
      this.unicode = (colour == "black" ? this.BLACK_UNICODE : this.WHITE_UNICODE);
   }

   Piece.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = this._processMoveData(selectedCoord, newCoord, turn, positions);
      return ((this.movedBackwards(moveData) || this.movedSideways(moveData) || this.movedForwards(moveData))
               && this.clearRouteStraight(moveData))
             || this.movedDiagonally(moveData) && this.clearRouteDiagonally(moveData);
   };

   Piece.prototype.clearRouteStraight = function(moveData) {
      var clearRoute = true;
      var selectedFileIndex = C.Engine.ALPHABET.indexOf(moveData.selectedCoordFile);
      var newFileIndex = C.Engine.ALPHABET.indexOf(moveData.newCoordFile);
      if (moveData.newCoordRow > moveData.selectedCoordRow) { // north
         for (var i = moveData.selectedCoordRow + 1; i < moveData.newCoordRow; i++) {
            clearRoute = this.checkForPiece(moveData.selectedCoordFile + i, moveData);
            if (!clearRoute) break;
         }
      } else if (moveData.newCoordRow < moveData.selectedCoordRow) { // south
         for (var i = moveData.selectedCoordRow - 1; i > moveData.newCoordRow; i--) {
            clearRoute = this.checkForPiece(moveData.selectedCoordFile + i, moveData);
            if (!clearRoute) break;
         }
      } else if (newFileIndex > selectedFileIndex) { // east
         for (var i = selectedFileIndex + 1; i < newFileIndex; i++) {
            clearRoute = this.checkForPiece(C.Engine.ALPHABET[i] + moveData.selectedCoordRow, moveData);
            if (!clearRoute) break;
         }
      } else if (newFileIndex < selectedFileIndex) { // west
         for (var i = selectedFileIndex - 1; i > newFileIndex; i--) {
            clearRoute = this.checkForPiece(C.Engine.ALPHABET[i] + moveData.selectedCoordRow, moveData);
            if (!clearRoute) break;
         }
      }
      return clearRoute;
   };

   Piece.prototype.checkForPiece = function(coord, moveData) {
      var clearRoute = true;
      if (moveData.positions[coord] instanceof Piece) {
         clearRoute = false;
         console.log('there was a blockage', coord, moveData.positions[coord]);
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
      return (moveData.selectedCoordRow == moveData.newCoordRow);
   };

   Piece.prototype.colour = null;

   Piece.prototype.BLACK_UNICODE = null;

   Piece.prototype.WHITE_UNICODE = null;

   C.Piece = Piece;

})();