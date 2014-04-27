(function(){

   "use strict";

   /**
    * Initialises the game instance.
    * @constructor
    */
   function Chess(){
      this.engine = new C.Engine();
      this.UI = new C.UI('chessboard', this.engine.positions);
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
//   C.Chess.engine.processMoveLog(["1. Pe2-e4 Pe7-e5", "2. Bf1-d3 Kb8-c6", "3. Pa2-a4 Pa7-a5", "4. Pb2-b4 Pa5xb4", "5. Pa4-a5 Kc6xa5", "6. Bd3-c4 Bf8-d6", "7. Kg1-f3 Kg8-h6", "8. Ke1-e2 Kh6-g4", "9. Ke2-d3 Pf7-f5", "10. Pe4xf5 Pe5-e4"]);

})();