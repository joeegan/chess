(function(){

   "use strict";

   /**
    * Initialises the UI and Engine and handles communication between them.
    */

   function Chess(){
      this.engine = new C.Engine();
      this.UI = new C.UI('chessboard', this.engine.positions);
      this.movelog = new C.MoveLog();
      this._initialiseEvents();
   }

   Chess.prototype._initialiseEvents = function(){
      this.UI.subscribe(C.UI.HUMAN_MOVE_MADE_EVENT, this.engine.checkMoveLegal, this.engine);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.UI.handleMoveDeemedLegal, this.UI);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.movelog.handleMoveDeemedLegal, this.movelog);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT, this.UI.handleMoveDeemedIllegal, this.UI);
      this.engine.subscribe(C.Engine.MOVELOG_PROCESSED, this.UI.handleMoveLogProcessed, this.UI);
      this.engine.subscribe(C.Engine.MOVELOG_PROCESSED, this.movelog.handleMoveLogProcessed, this.movelog);
   };

   C.Chess = new Chess();
   C.Chess.engine.processMoveLog(["1. Pa2-a3 Pa7-a6", "2. Pb2-b3 Pb7-b6", "3. Pc2-c3 Pc7-c6", "4. Pd2-d3 Pd7-d6", "5. Pe2-e3 Pe7-e6", "6. Pf2-f3 Pf7-f6", "7. Pg2-g3 Pg7-g6", "8. Ph2-h4 Ph7-h6", "9. Pe3-e4 Pd6-d5", "10. Qd1-d2 Pb6-b5", "11. Qd2-d1 Pb5-b4"]);

})();