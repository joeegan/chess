describe('Rook', function() {

   it('Can move straight lines', function() {
      expect(engine.checkLegal('a1', 'a5')).toBe(true);
      engine.makeMove('Ra1-a5');
      expect(engine.checkLegal('h8', 'f8')).toBe(true);
      engine.makeMove('Rh8-f8');
      expect(engine.checkLegal('h1', 'e1')).toBe(true);
      engine.makeMove('Rh1-e1');
      expect(engine.checkLegal('f8', 'f5')).toBe(true);
   });

   it('Can\'t move non-straight lines', function() {
      expect(engine.checkLegal('a1', 'b2')).toBe(false);
      engine.makeMove('Ra1-a2');
      expect(engine.checkLegal('a8', 'b6')).toBe(false);
      engine.makeMove('Ra8-a7');
      expect(engine.checkLegal('a2', 'b1')).toBe(false);
      expect(engine.checkLegal('a2', 'c3')).toBe(false);
   });

   it('Can\'t move from starting position', function() {
      engine = new C.Engine(); // resets board to starting pos
      expect(engine.checkLegal('a1', 'a3')).toBe(false);
      expect(engine.checkLegal('h1', 'h3')).toBe(false);
      engine.makeMove('Pa2-a3');
      expect(engine.checkLegal('a8', 'a5')).toBe(false);
      expect(engine.checkLegal('h8', 'h4')).toBe(false);
   });

   it('Can\'t move past obstructions', function() {
      expect(engine.checkLegal('a1', 'g1')).toBe(false);
      expect(engine.checkLegal('h1', 'a3')).toBe(false);
      engine.makeMove('Bh1-g1');
      expect(engine.checkLegal('a8', 'f8')).toBe(false);
      expect(engine.checkLegal('h8', 'h6')).toBe(false);
   });

   beforeEach(function() {
      engine = new C.Engine();
      engine.processMoveLog(["1. Pe2-e4 Pe7-e5", "2. Bf1-d3 Kb8-c6", "3. Pa2-a4 Pa7-a5", "4. Pb2-b4 Pa5xb4", "5. Pa4-a5 Kc6xa5", "6. Bd3-c4 Bf8-d6", "7. Kg1-f3 Kg8-h6", "8. Ke1-e2 Kh6-g4", "9. Ke2-d3 Pf7-f5", "10. Pe4xf5 Pe5-e4"]);
   });

   afterEach(function() {
      engine = null;
   });

   var engine;

});