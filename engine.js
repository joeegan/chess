(function(){

   'use strict';

   /**
    * The chess engine.
    * Publishes when legal moves are made, looks after the positions object.
    * Can process a moveLog.
    * Exposes some constant chess data to other classes e.g. ALPHABET.
    * TODO: respond with moves.
    * @constructor
    * @extends Observer
    */
   function Engine(){
      this.buildPositions();
   }
   Engine.prototype = Object.create(Observer.prototype);

   /**
    * Stores the state of the board, which pieces occupy which coords.
    * @type {{C.Piece|Object}} e.g { a1: C.Rook, a2: C.Pawn, a3: {} }
    */
   Engine.prototype.positions = {};

   /**
    * @type {String} Which colour is currently permitted to move.
    */
   Engine.prototype.turn = 'white';

   /**
    * @param lan e.g. 'Pa2-a3'
    */
   Engine.prototype.handleMoveAttempted = function(lan) {
      var selectedCoord = lan.match(/[a-z]\d/)[0];
      var newCoord = lan.match(/[a-z]\d$/)[0];
      if (this._checkLegal(selectedCoord, newCoord)) {
         this.place(selectedCoord, newCoord);
         this.publish(Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.positions, lan, this.turn);
         this.changeTurn(this.positions[newCoord].colour);
      } else {
         this.publish(Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT, this.positions);
      }
   };

   /**
    * @param {String} selectedCoord e.g. e2
    * @param {String} newCoord e.g. e5
    * @returns {boolean} Whether the rules of chess permit the attempted move.
    */
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

   /**
    * @param selectedColour
    * @param newColour
    * @returns {boolean} Whether an attempt was made on a piece of the same colour as the selected piece.
    */
   Engine.prototype.tookOwnPiece = function(selectedColour, newColour) {
      if (selectedColour == newColour) {
         console.log('can\'t take own piece');
         return true;
      }
      return false;
   };

   /**
    * Returns true if two moves were attempted by the same colour.
    * @param {String} selectedColour Either 'white' or 'black'
    * @returns {Boolean}
    */
   Engine.prototype.tookConsecutiveTurns = function(selectedColour){
      if (selectedColour != this.turn) {
         console.log('it is not ' + selectedColour + '\'s turn');
         return true;
      }
      return false;
   };

   /**
    * Moves a piece in the positions object.
    * @param {String} selectedCoord
    * @param {String} newCoord
    */
   Engine.prototype.place = function(selectedCoord, newCoord){
      this.positions[newCoord] = this.positions[selectedCoord];
      this.positions[selectedCoord] = {};
   };

   /**
    * Changes the turn away from the supplied colour.
    * @param {String} currentColour Either 'white' or 'black'
    */
   Engine.prototype.changeTurn = function(currentColour) {
     this.turn = (currentColour == 'white') ? 'black' : 'white';
   };

   /**
    * Sets up the positions object with the standard chess opening positions.
    */
   Engine.prototype.buildPositions = function(){
      var piece;
      var positions = {};

      for (var i = 0; i < Engine.SQUARES_PER_RANK; i++) {
         for (var x = 0; x < Engine.SQUARES_PER_RANK; x++) {
            positions[Engine.ALPHABET[x] + (Engine.SQUARES_PER_RANK-i)] = {}
         }
      }

      for (var i = 0; i < Engine.SQUARES_PER_RANK; i++) {
         positions[Engine.ALPHABET[i] + 2] = new C.Pawn('white');
         positions[Engine.ALPHABET[i] + (Engine.SQUARES_PER_RANK - 1)] = new C.Pawn('black');
         piece = new C[Engine.PIECE_ORDER[i]]('white');
         positions[Engine.ALPHABET[i] + 1] = piece;
         piece = new C[Engine.PIECE_ORDER[i]]('black');
         positions[Engine.ALPHABET[i] + Engine.SQUARES_PER_RANK] = piece;
      }
      this.positions = positions;
   };

   /**
    * MoveLog's vaguely resemble PGN and are used to speed up development.
    * @param {Array} moveLog e.g. ["1. Pa2-a3 Pa7-a6", "2. Pb2-b3 Pb7-b6"]
    */
   Engine.prototype.processMoveLog = function(moveLog) {
      var selectedCoord,
          newCoord,
          movePair;
      for (var i = 0; i < moveLog.length; i++) {
         movePair = moveLog[i];
         selectedCoord = movePair.split(' ')[1].slice(1,3);
         newCoord = movePair.split(' ')[1].slice(4,6);
         this.place(selectedCoord, newCoord);
         this.changeTurn('white');
         if (movePair.split(' ')[2]) {
            selectedCoord = movePair.split(' ')[2].slice(1,3);
            newCoord = movePair.split(' ')[2].slice(4,6);
            this.place(selectedCoord, newCoord);
            this.changeTurn('black');
         }
      }
      this.publish(Engine.MOVELOG_PROCESSED, this.positions, this.turn, moveLog);
   };

   /**
    * @type {string}
    */
   Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT = "humanMoveDeemedLegalEvent";

   /**
    * @type {string}
    */
   Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT = "humanMoveDeemedIllegalEvent";

   /**
    * @type {string}
    */
   Engine.MOVELOG_PROCESSED = "moveLogProcessedEvent";

   /**
    * @type {Array}
    */
   Engine.ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

   /**
    * @type {Array}
    */
   Engine.PIECE_ORDER = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];

   /**
    * @type {Array}
    */
   Engine.SQUARES_PER_RANK = 8;

   C.Engine = Engine;

})();
