(function(){

   /*
      Responds with a chess move when required along with a positions object containing the men by coordinate.
      Exposes things that UIs may want to use.
    */


   'use strict';

   function Engine(){
      this.buildPositions();
   }

   Engine.prototype = Object.create(Observer.prototype);

   Engine.prototype.positions = {};

   Engine.prototype.turn = 'white';

   Engine.prototype.checkMoveLegal = function(lan, isHuman) {
      var selectedCoord = lan.match(/[a-z]\d/)[0];
      var newCoord = lan.match(/[a-z]\d$/)[0];
      if (this._checkLegal(selectedCoord, newCoord)) {
         if (isHuman) {
            this.place(selectedCoord, newCoord);
            this.publish(Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.positions, lan, this.turn);
            this.changeTurn(this.positions[newCoord].colour);
         }
      } else if (isHuman) {
         this.publish(Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT, this.positions);
      }
   };

   Engine.prototype._checkLegal = function(selectedCoord, newCoord) {
      var selectedColour = this.positions[selectedCoord].colour;
      var newColour = this.positions[newCoord].colour;
      if ((this.positions[newCoord] instanceof C.Piece
         && this.tookOwnPiece(selectedColour, newColour))
         || this.tookConsecutiveTurns(selectedColour)
         || !this.positions[selectedCoord].checkLegal(selectedCoord, newCoord, this.turn, this.positions)
         ) {
         return false;
      }
      return true;
   };

   Engine.prototype.tookOwnPiece = function(selectedColour, newColour) {
      if (selectedColour == newColour) {
         console.log('can\'t take own piece');
         return true;
      }
      return false;
   };

   Engine.prototype.tookConsecutiveTurns = function(selectedColour){
      if (selectedColour != this.turn) {
         console.log('it is not ' + selectedColour + '\'s turn');
         return true;
      }
      return false;
   };

   Engine.prototype.place = function(selectedCoord, newCoord){
      this.positions[newCoord] = this.positions[selectedCoord];
      this.positions[selectedCoord] = {};
   };

   Engine.prototype.changeTurn = function(colour) {
     this.turn = (colour == 'white') ? 'black' : 'white';
   };

   Engine.prototype.buildPositions = function(){
      var piece;
      var positions = {};

      for (var i = 0; i < Engine.SQUARES_PER_ROW; i++) {
         for (var x = 0; x < Engine.SQUARES_PER_ROW; x++) {
            positions[Engine.ALPHABET[x] + (Engine.SQUARES_PER_ROW-i)] = {}
         }
      }

      for (var i = 0; i < Engine.SQUARES_PER_ROW; i++) {
         positions[Engine.ALPHABET[i] + 2] = new C.Pawn('white');
         positions[Engine.ALPHABET[i] + (Engine.SQUARES_PER_ROW - 1)] = new C.Pawn('black');
         piece = new C[Engine.PIECE_ORDER[i]]('white');
         positions[Engine.ALPHABET[i] + 1] = piece;
         piece = new C[Engine.PIECE_ORDER[i]]('black');
         positions[Engine.ALPHABET[i] + Engine.SQUARES_PER_ROW] = piece;
      }
      this.positions = positions;
   };

   Engine.prototype.processPgnLog = function(pgnLog) {
      var selectedCoord;
      var newCoord;
      pgnLog.forEach(function(movePair, idx) {
         selectedCoord = movePair.split(' ')[1].slice(1,3);
         newCoord = movePair.split(' ')[1].slice(4,6);
         this.place(selectedCoord, newCoord);
         this.changeTurn('black');
         if (movePair.split(' ')[2]) {
            selectedCoord = movePair.split(' ')[2].slice(1,3);
            newCoord = movePair.split(' ')[2].slice(4,6);
            this.place(selectedCoord, newCoord);
            this.changeTurn('white');
         }
      }.bind(this));
      this.publish(Engine.PGN_PROCESSED, this.positions, this.turn);
   };

   Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT = "humanMoveDeemedLegalEvent";

   Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT = "humanMoveDeemedIllegalEvent";

   Engine.PGN_PROCESSED = "pgnProcessedEvent";

   Engine.ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

   Engine.PIECE_ORDER = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];

   Engine.SQUARES_PER_ROW = 8;

   C.Engine = Engine;

})();
