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
      this.UI.subscribe(C.UI.HUMAN_MOVE_MADE_EVENT, this.engine.handleMoveAttempted, this.engine);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.UI.handleMoveDeemedLegal, this.UI);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.movelog.handleMove, this.movelog);
      this.engine.subscribe(C.Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT, this.UI.handleMoveDeemedIllegal, this.UI);
//      this.engine.subscribe(C.Engine.COMPUTER_MOVE_MADE_EVENT, this.UI.handleComputerMoveMade, this.UI);
//      this.engine.subscribe(C.Engine.COMPUTER_MOVE_MADE_EVENT, this.movelog.handleMove, this.movelog);
      this.engine.subscribe(C.Engine.MOVELOG_PROCESSED_EVENT, this.UI.handleMoveLogProcessed, this.UI);
      this.engine.subscribe(C.Engine.MOVELOG_PROCESSED_EVENT, this.movelog.handleMoveLogProcessed, this.movelog);
   };

   /**
    * Expose the game for easy debugging.
    */
   C.Chess = new Chess();

   /**
    * Temporary! - To help with development drop in a moveLog here to reinitialise the game with a different position state.
    */
   // C.Chess.engine.processMoveLog(["1. Pa2-a3 Pa7-a6", "2. Pb2-b3 Pb7-b6", "3. Pc2-c3 Pc7-c6", "4. Pd2-d3 Pd7-d6", "5. Pe2-e3 Pe7-e6", "6. Pf2-f3 Pf7-f6", "7. Pg2-g3 Pg7-g6", "8. Ph2-h4 Ph7-h6", "9. Pe3-e4 Pd6-d5", "10. Qd1-d2 Pb6-b5", "11. Qd2-d1 Pb5-b4", "12. Bc1-g5 Pe6-e5", "13. Qd1-d2 Pc6-c5", "14. Bf1-h3 Kg8-e7", "15. Bg5xh6 Bc8-d7", "16. Bh6-c1 Pd5-d4", "17. Qd2-g5 Pc5-c4", "18. Bc1-d2 Pa6-a5", "19. Pb3xc4 Pb4xa3", "20. Ra1-a2 Pa5-a4", "21. Ra2-b2 Ra8-a6", "22. Rb2-b5 Ra6-a5", "23. Pg3-g4 Rh8xh4", "24. Qg5-h5 Rh4xg4", "25. Qh5-h6 Rg4xe4", "26. Pf3-f4 Re4-e2", "27. Pf4-f5 Qd8-b6", "28. Pc4-c5 Qb6xb5", "29. Pc3-c4 Qb5-b2", "30. Bd2-g5 Qb2-d2", "31. Pc5-c6 Ra5-b5", "32. Pc4-c5 Rb5-b2", "33. Pc6-c7 Rb2xb1", "34. Pc5-c6 Rb1-d1"]);

})();