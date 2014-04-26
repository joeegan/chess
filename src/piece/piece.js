(function(){

   // Consider piece factory, rather than separate pieces

   'use strict';

   function Piece(colour){
      this.colour = colour;
      this.unicode = (colour == "black" ? this.BLACK_UNICODE : this.WHITE_UNICODE);
   }

   Piece.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = Piece.processMoveData(selectedCoord, newCoord, turn, positions);
      return ((Piece.movedBackwards(moveData) || Piece.movedSideways(moveData) || Piece.movedForwards(moveData))
               && Piece.clearRouteStraight(moveData))
             || Piece.movedDiagonally(moveData) && Piece.clearRouteDiagonally(moveData);
   };

   Piece.clearRouteStraight = function(moveData) {
      var clearRoute = true;
      var selectedFileIndex = C.Engine.ALPHABET.indexOf(moveData.selectedCoordFile);
      var newFileIndex = C.Engine.ALPHABET.indexOf(moveData.newCoordFile);
      if (moveData.newCoordRank > moveData.selectedCoordRank) { // north
         for (var i = moveData.selectedCoordRank + 1; i < moveData.newCoordRank; i++) {
            clearRoute = Piece.checkForPiece(moveData.selectedCoordFile + i, moveData);
            if (!clearRoute) break;
         }
      } else if (moveData.newCoordRank < moveData.selectedCoordRank) { // south
         for (var i = moveData.selectedCoordRank - 1; i > moveData.newCoordRank; i--) {
            clearRoute = Piece.checkForPiece(moveData.selectedCoordFile + i, moveData);
            if (!clearRoute) break;
         }
      } else if (newFileIndex > selectedFileIndex) { // east
         for (var i = selectedFileIndex + 1; i < newFileIndex; i++) {
            clearRoute = Piece.checkForPiece(C.Engine.ALPHABET[i] + moveData.selectedCoordRank, moveData);
            if (!clearRoute) break;
         }
      } else if (newFileIndex < selectedFileIndex) { // west
         for (var i = selectedFileIndex - 1; i > newFileIndex; i--) {
            clearRoute = Piece.checkForPiece(C.Engine.ALPHABET[i] + moveData.selectedCoordRank, moveData);
            if (!clearRoute) break;
         }
      }
      return clearRoute;
   };

   Piece.checkForPiece = function(coord, moveData) {
      var clearRoute = true;
      if (moveData.positions[coord] instanceof Piece) {
         clearRoute = false;
         console.log('there was a blockage', coord, moveData.positions[coord]);
      }
      return clearRoute;
   };

   Piece.clearRouteDiagonally = function(moveData) {
      var clearRoute = true;
      var selectedFileIndex = C.Engine.ALPHABET.indexOf(moveData.selectedCoordFile);
      var newFileIndex = C.Engine.ALPHABET.indexOf(moveData.newCoordFile);
      var coordToCheck;
      var negativeFileIncrement = selectedFileIndex - 1;
      var positiveFileIncrement = selectedFileIndex + 1;
      var positiveRankIncrement = moveData.selectedCoordRank + 1;
      var negativeRankIncrement = moveData.selectedCoordRank - 1;
      var difference = selectedFileIndex > newFileIndex ? selectedFileIndex - newFileIndex : newFileIndex - selectedFileIndex;
      for (var i = 1; i < difference; i++) {
         clearRoute = false;
         if (newFileIndex > selectedFileIndex && moveData.newCoordRank > moveData.selectedCoordRank) {
            coordToCheck = C.Engine.ALPHABET[positiveFileIncrement]+positiveRankIncrement; // north east
         } else if (newFileIndex < selectedFileIndex && moveData.newCoordRank > moveData.selectedCoordRank) {
            coordToCheck = C.Engine.ALPHABET[negativeFileIncrement]+positiveRankIncrement; // north west
         } else if (newFileIndex > selectedFileIndex && moveData.newCoordRank < moveData.selectedCoordRank) {
            coordToCheck = C.Engine.ALPHABET[positiveFileIncrement]+negativeRankIncrement; // south east
         } else if (newFileIndex < selectedFileIndex && moveData.newCoordRank < moveData.selectedCoordRank) {
            coordToCheck = C.Engine.ALPHABET[negativeFileIncrement]+negativeRankIncrement; // south west
         }
         clearRoute = !(moveData.positions[coordToCheck] instanceof C.Piece);
         if (!clearRoute) {
            console.log('there was a blockage', coordToCheck, moveData.positions[coordToCheck]);
            break;
         }
         negativeFileIncrement--;
         positiveFileIncrement++;
         negativeRankIncrement--;
         positiveRankIncrement++;
      }
      return clearRoute;
   };

   Piece.processMoveData = function(selectedCoord, newCoord, turn, positions){
      return {
         selectedCoord: selectedCoord,
         newCoord: newCoord,
         selectedCoordRank: +selectedCoord.slice(1),
         selectedCoordFile: selectedCoord.slice(0,1),
         newCoordFile: newCoord.slice(0,1),
         newCoordRank: +newCoord.slice(1),
         turn: turn,
         positions: positions
      }
   };

   Piece.movedBackwards = function(moveData) {
      if ((moveData.turn == 'white'
           && moveData.newCoordRank < moveData.selectedCoordRank
           && moveData.newCoordFile == moveData.selectedCoordFile)
      || (moveData.turn == 'black'
          && moveData.newCoordRank > moveData.selectedCoordRank
          && moveData.newCoordFile == moveData.selectedCoordFile)) {
         console.log('move was backwards');
         return true;
      }
      return false;
   };

   Piece.movedForwards = function(moveData) {
      if ((moveData.turn == 'white'
         && moveData.newCoordRank > moveData.selectedCoordRank
         && moveData.newCoordFile == moveData.selectedCoordFile)
         || (moveData.turn == 'black'
         && moveData.newCoordRank < moveData.selectedCoordRank
         && moveData.newCoordFile == moveData.selectedCoordFile)) {
         console.log('move was forwards');
         return true;
      }
      return false;
   };

   Piece.movedDiagonally = function(moveData) {
      var ALPHABET = C.Engine.ALPHABET;
      var coordFileDifference = Math.abs(ALPHABET.indexOf(moveData.selectedCoordFile) - ALPHABET.indexOf(moveData.newCoordFile));
      var coordRankDifference = Math.abs(moveData.selectedCoordRank - moveData.newCoordRank);
      if (coordFileDifference == coordRankDifference) {
         console.log('diagonal move attempted');
         return true;
      }
      return false;
   };

   Piece.movedSideways = function(moveData) {
      return (moveData.selectedCoordRank == moveData.newCoordRank);
   };

   Piece.prototype.colour = null;

   Piece.prototype.BLACK_UNICODE = null;

   Piece.prototype.WHITE_UNICODE = null;

   C.Piece = Piece;

})();