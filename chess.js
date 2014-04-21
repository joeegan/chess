(function(){

   "use strict";

   /**
    * Initialises the UI and Engine and handles communication between them.
    * @constructor
    */
   function Chess(){
      this.engine = new C.Engine();
      this.UI = new C.UI('chessboard', this.engine.positions);
      this.movelog = new C.MoveLog();
      this._initialiseEvents();
   }

   Chess.prototype._initialiseEvents = function(){
      this.UI.subscribe(C.UI.HUMAN_MOVE_MADE_EVENT, this.engine.makeMove, this.engine);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.UI.handleMoveDeemedLegal, this.UI);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.movelog.handleMoveDeemedLegal, this.movelog);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT, this.UI.handleMoveDeemedIllegal, this.UI);
      this.engine.subscribe(C.Engine.MOVELOG_PROCESSED, this.UI.handleMoveLogProcessed, this.UI);
      this.engine.subscribe(C.Engine.MOVELOG_PROCESSED, this.movelog.handleMoveLogProcessed, this.movelog);
   };

   /**
    * Expose the game for easy debugging.
    */
   C.Chess = new Chess();

   /**
    * Temporary! - To help with development drop in a moveLog here to reinitialise the game with a different position state.
    */
   C.Chess.engine.processMoveLog(["1. Pe2-e4 Pe7-e5", "2. Pd2-d4 Pd7-d5", "3. Bc1-g5 Bf8-b4", "4. Bf1-b5 Bc8-g4", "5. Qd1-d2 Qd8-d7"]);

})();