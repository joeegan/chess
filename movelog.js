(function(){

   "use strict";

   /**
    * Vaguely resembles Portable Game Notation.
    * This only parses the following style of notation: 1. Pe2-e5 Pd7-d4 2. Pe5xd4 Nb8-c6
    * The intention is to speed up development time by adding the ability to supply the engine with a starting position.
    */

   function MoveLog(){
   }

   MoveLog.prototype.handleMoveDeemedLegal = function(positions, lan, turn) {
      this.add(lan, turn);
   };

   MoveLog.prototype.add = function(lan, turn) {
      if (turn == "white") {
         this.log.push((this.log.length + 1) +'. ' + lan);
      } else {
         this.log[this.log.length - 1] =  this.log[this.log.length - 1] + ' ' + lan;
      }
      console.log(this.log);
   };

   MoveLog.prototype.log = [];

   C.MoveLog = MoveLog;

})();