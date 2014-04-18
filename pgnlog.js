(function(){

   "use strict";

   /**
    * Initialises the UI and Engine and handles communication between them.
    */

   /*
    * @param {Object} [positions] Optionally pass in your own positions,
    * to allow testing of certain positions.
    */
   function PgnLog(){
   }

   PgnLog.prototype.handleMoveDeemedLegal = function(positions, lan, turn) {
      this.add(lan, turn);
   };

   PgnLog.prototype.add = function(lan, turn) {
      if (turn == "white") {
         this.log.push((this.log.length + 1) +'. ' + lan);
      } else {
         this.log[this.log.length - 1] =  this.log[this.log.length - 1] + ' ' + lan;
      }
      console.log(this.log);
   };

   PgnLog.prototype.log = [];

   C.PgnLog = PgnLog;

})();