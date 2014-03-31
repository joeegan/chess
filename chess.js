//(function(){

   /**
    * Initialises the UI and Engine and handles communication between them.
    */

   function Chess(){
      this.engine = new Engine();
      this.UI = new UI('chessboard', this.engine.positions);
      this._initialiseEvents();
   }

   Chess.prototype._initialiseEvents = function(){
      this.UI.on(UI.HUMAN_MOVE_MADE_EVENT, this.engine.checkMoveLegal, this.engine);
      this.engine.on(Engine.HUMAN_MOVE_DEEMED_LEGAL_EVENT, this.UI.handleMoveDeemedLegal, this.UI);
   };

   new Chess();


//})();
