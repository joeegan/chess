(function(){

   "use strict";

   /**
    * Initialises the UI and Engine and handles communication between them.
    */

   function Chess(){
      this.engine = new C.Engine();
      this.UI = new C.UI('chessboard', this.engine.positions);
      this.pgnlog = new C.PgnLog();
      this._initialiseEvents();
   }

   Chess.prototype._initialiseEvents = function(){
      this.UI.subscribe(C.UI.HUMAN_MOVE_MADE_EVENT, this.engine.checkMoveLegal, this.engine);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.UI.handleMoveDeemedLegal, this.UI);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.pgnlog.handleMoveDeemedLegal, this.pgnlog);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT, this.UI.handleMoveDeemedIllegal, this.UI);
      this.engine.subscribe(C.Engine.PGN_PROCESSED, this.UI.handlePgnLogProcesed, this.UI);
   };

   C.Chess = new Chess();
   C.Chess.engine.processPgnLog(["1. Pd2-d4 Pc7-c5", "2. Pe2-e3 Kb8-a6", "3. Qd1-g4"]);

})();