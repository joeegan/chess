describe('Bishop', function() {

   it('Can move diagonally', function() {
      expect(engine.checkLegal('g5', 'd8')).toBe(true);
      engine.makeMove('Bg5-d8');
      expect(engine.checkLegal('b4', 'd2')).toBe(true);
      engine.makeMove('Bb4xd2');
      expect(engine.checkLegal('b5', 'a6')).toBe(true);
      engine.makeMove('Bb5-a4');
      expect(engine.checkLegal('g4', 'e6')).toBe(true);
   });

   it('Can\'t move non diagonally', function() {
      expect(engine.checkLegal('g5', 'e5')).toBe(false);
      expect(engine.checkLegal('b5', 'b6')).toBe(false);
      expect(engine.checkLegal('b5', 'b4')).toBe(false);
      expect(engine.checkLegal('g5', 'h5')).toBe(false);
   });

   it('Can\'t move from starting position', function() {
      engine = new C.Engine(); // resets board to starting pos
      expect(engine.checkLegal('c1', 'e3')).toBe(false);
      expect(engine.checkLegal('f1', 'h3')).toBe(false);
      engine.makeMove('Pa2-a3');
      expect(engine.checkLegal('c8', 'f5')).toBe(false);
      expect(engine.checkLegal('f8', 'b4')).toBe(false);
   });

   it('Can\'t move past obstructions', function() {
      expect(engine.checkLegal('b5', 'e8')).toBe(false);
      expect(engine.checkLegal('g5', 'c1')).toBe(false);
      engine.makeMove('Bg5-d8');
      expect(engine.checkLegal('g4', 'c8')).toBe(false);
      expect(engine.checkLegal('b4', 'e1')).toBe(false);
   });

   beforeEach(function() {
      engine = new C.Engine();
      engine.processMoveLog(["1. Pe2-e4 Pe7-e5", "2. Pd2-d4 Pd7-d5", "3. Bc1-g5 Bf8-b4", "4. Bf1-b5 Bc8-g4", "5. Qd1-d2 Qd8-d7"] );
   });

   afterEach(function() {
      engine = null;
   });

   var engine;

});