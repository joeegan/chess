(function(){

   'use strict';

   function Pawn(){
      Pawn.superclass.constructor.apply(this, arguments);
   }
   C.extend(Pawn, C.Piece);

   Pawn.prototype.checkLegal = function(selectedCoord, newCoord, turn, positions) {
      var moveData = this._processMoveData(selectedCoord, newCoord, turn, positions);
      return (this.movedDiagonally(moveData)
         || this.movedForwards(moveData) && this.clearRouteStraight(moveData));
   };

   Pawn.prototype.movedForwards = function(moveData) {
      // Pawns multimove exception is white row 2 - 4, black row 7 - 5.
      if (moveData.turn == 'white'
          && moveData.selectedCoordRank == 2
          && moveData.newCoordRank == 4
          && moveData.selectedCoordFile == moveData.newCoordFile) {
         console.log('took initial pawn two-coord leap');
         return true;
      } else if (moveData.turn == 'black'
         && moveData.selectedCoordRank == 7
         && moveData.newCoordRank == 5
         && moveData.selectedCoordFile == moveData.newCoordFile) {
         console.log('took initial pawn two-coord leap');
         return true;
      } else if (moveData.turn == 'white'
         && moveData.newCoordRank - moveData.selectedCoordRank == 1
         && moveData.selectedCoordFile == moveData.newCoordFile) {
         return true;
      } else if (moveData.turn == 'black'
         && moveData.selectedCoordRank - moveData.newCoordRank == 1
         && moveData.selectedCoordFile == moveData.newCoordFile) {
         return true;
      } else {
         return false;
      }
   };

   Pawn.prototype.movedDiagonally = function(moveData) {
      // Pawns are allowed to move diagonally one square forward when there is a piece in that coord.
      var ALPHABET = C.Engine.ALPHABET;
      var coordFileDifference = Math.abs(ALPHABET.indexOf(moveData.selectedCoordFile) - ALPHABET.indexOf(moveData.newCoordFile));
      var coordRankDifference = Math.abs(moveData.selectedCoordRank - moveData.newCoordRank);
      var moveWasForward;
      if (moveData.turn == 'white') {
         moveWasForward = moveData.newCoordRank > moveData.selectedCoordRank;
      } else {
         moveWasForward = moveData.newCoordRank < moveData.selectedCoordRank;
      }
      if (coordFileDifference == 1
          && coordRankDifference == 1
          && moveWasForward
          && moveData.positions[moveData.newCoord] instanceof C.Piece) {
         return true;
      } else {
         return false;
      }
   };

   Pawn.prototype.clearRouteStraight = function(moveData) {
      return !(moveData.positions[moveData.newCoord] instanceof C.Piece);
   };

   Pawn.prototype.BLACK_UNICODE = '\u265F';

   Pawn.prototype.WHITE_UNICODE = '\u2659';

   C.Pawn = Pawn;

})();