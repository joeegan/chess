(function(){

   "use strict";

   /**
    * MoveLog vaguely resembles Portable Game Notation.
    * The engine can currently only parses the following style: 1. Pe2-e5 Pd7-d4 2. Pe5xd4 Nb8-c6
    * The intention behind MoveLog is to speed up development time by adding the ability to supply the engine with a starting position.
    * Once several moves have been made to get the board into a particular position,
    * the developer can copy the movelog out of the developer tools console and pass that log to the engine with C.Chess.engine.processMoveLog.
    */
   function MoveLog(){
      this.log = [];
   }

   /**
    * Receive a move and add it to the log.
    * @param {Object} positions
    * @param {String} lan e.g. Rg4xe4
    * @param {String} turn i.e. 'white' or 'black'
    */
   MoveLog.prototype.handleMoveDeemedLegal = function(positions, lan, turn) {
      this.add(lan, turn);
   };

   /**
    * When a moveLog is handed to the engine, the engine processes it and the UI redraws the board.
    * The log is then stored here so that future moves can continue to be recorded with historical data.
    * @param {Object} positions
    * @param {String} turn i.e. 'white' or 'black'
    * @param {String} lan e.g. Rg4xe4
    */
   MoveLog.prototype.handleMoveLogProcessed = function(positions, turn, log) {
      this.log = log;
   };

   /**
    * Add a move to the movelog.
    */
   MoveLog.prototype.add = function(lan, turn) {
      if (turn == "white") {
         this.log.push((this.log.length + 1) +'. ' + lan);
      } else {
         this.log[this.log.length - 1] =  this.log[this.log.length - 1] + ' ' + lan;
      }
      console.log(this.log);
   };

   /**
    * @type {String[]}
    */
   MoveLog.prototype.log = null;

   C.MoveLog = MoveLog;

})();
