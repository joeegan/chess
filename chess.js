//(function(){

// Handles communication between engine and UI


   function Chess(){
      this.engine = new Engine();
      this.UI = new UI('chessboard', this.engine.positions);
   }

   new Chess();


//})();
