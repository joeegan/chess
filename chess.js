(function(){

   /**
    * Initialises the UI and Engine and handles communication between them.
    */

   function Chess(){
      this.engine = new C.Engine();
      this.UI = new C.UI('chessboard', this.engine.positions);
      this._initialiseEvents();
   }

   Chess.prototype._initialiseEvents = function(){
      this.UI.on(C.UI.HUMAN_MOVE_MADE_EVENT, this.engine.checkMoveLegal, this.engine);
      this.engine.on(C.Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.UI.handleMoveDeemedLegal, this.UI);
      this.engine.on(C.Engine.HUMAN_MOVE_DEEMED_ILLEGAL_EVENT, this.UI.handleMoveDeemedIllegal, this.UI);
   };

   new Chess();

})();