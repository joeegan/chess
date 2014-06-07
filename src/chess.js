(function(){

   "use strict";

   /**
    * Initialises the game instance.
    * @constructor
    */
   function Chess(){
      this.engine = new C.Engine();
      this.UI = new C.UI('chessboard', this.engine.positions, false).withSwitchControl('switchcontrol');
      this.movelog = new C.MoveLog();
      this._initialiseEvents();
   }

   /**
    * Handles communication between classes.
    * @private
    */
   Chess.prototype._initialiseEvents = function(){
      this.UI.subscribe(C.UI.HUMAN_MOVE_MADE_EVENT, this.engine.makeMove, this.engine);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.UI.handleMoveDeemedLegal, this.UI);
      this.engine.subscribe(C.Engine.CHECK_EVENT, this.UI.handleCheck, this.UI);
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
   C.Chess.engine.processMoveLog(["1. Pe2-e4 Pd7-d5", "2. Pe4xd5 Pe7-e6", "3. Pd5xe6 Pf7xe6", "4. Qd1-e2 Ph7-h6"]);

})();