describe('Queen', function() {

   it('Can move straght lines', function() {
      expect(engine.checkLegal('d1', 'e1')).toBe(true);
      engine.makeMove('Qd1-e1');
      engine.makeMove('Pd8-e7');
      expect(engine.checkLegal('e1', 'e4')).toBe(true);
      engine.makeMove('Qe1-e4');
      expect(engine.checkLegal('e7', 'e5')).toBe(true);
      engine.makeMove('Qe7-e5');
      expect(engine.checkLegal('e4', 'e1')).toBe(true);
   });

   it('Can move diagonally', function() {
      expect(engine.checkLegal('d1', 'e2')).toBe(true);
      engine.makeMove('Qd1-e2');
      expect(engine.checkLegal('d8', 'g5')).toBe(true);
      engine.makeMove('Qd8-g5');
      engine.makeMove('Qe2-e3');
      expect(engine.checkLegal('g5', 'f6')).toBe(true);
      engine.makeMove('Qg5-f6');
      expect(engine.checkLegal('e3', 'a7')).toBe(true);
      engine.makeMove('Qe3-a7');
      expect(engine.checkLegal('f6', 'a1')).toBe(true);
      engine.makeMove('Qf6xa1');
   });

   it('Can\'t move irregularly', function() {
      expect(engine.checkLegal('d1', 'c3')).toBe(false);
      engine.makeMove('Qd1-e1');
      expect(engine.checkLegal('d8', 'f7')).toBe(false);
      engine.makeMove('Qd8-e7');
      expect(engine.checkLegal('e1', 'c3')).toBe(false);
   });

   it('Can\'t move from starting position', function() {
      engine = new C.Engine(); // resets board to starting pos
      expect(engine.checkLegal('d1', 'd3')).toBe(false);
      engine.makeMove('Pa2-a3');
      expect(engine.checkLegal('d8', 'f6')).toBe(false);
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