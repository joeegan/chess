describe('King', function() {

   it('Can move one square in any direction and capture', function() {
      expect(engine.checkLegal('d3', 'e2')).toBe(true);
      engine.makeMove('Kd3-e2');
      expect(engine.checkLegal('e8', 'e7')).toBe(true);
      engine.makeMove('Ke8-e7');
      expect(engine.checkLegal('e2', 'd3')).toBe(true);
      engine.makeMove('Ke2-d3');
      expect(engine.checkLegal('e7', 'e8')).toBe(true);
      engine.makeMove('Ke7-e8');
      expect(engine.checkLegal('d3', 'e4')).toBe(true);
      engine.makeMove('Kd3xe4');
   });

   it('Can\'t move more than one square', function() {
      expect(engine.checkLegal('d3', 'd5')).toBe(false);
      expect(engine.checkLegal('d3', 'b3')).toBe(false);
      expect(engine.checkLegal('d3', 'f1')).toBe(false);
      engine.makeMove('Pc2-c3');
      expect(engine.checkLegal('e8', 'g8')).toBe(false);
      expect(engine.checkLegal('e8', 'e5')).toBe(false);
   });

   it('Can\'t move from starting position', function() {
      engine = new C.Engine(); // resets board to starting pos
      expect(engine.checkLegal('e1', 'e2')).toBe(false);
      expect(engine.checkLegal('e1', 'e3')).toBe(false);
      engine.makeMove('Pa2-a3');
      expect(engine.checkLegal('e8', 'e7')).toBe(false);
      expect(engine.checkLegal('e8', 'e6')).toBe(false);
   });

   // TODO: Can't move into check

   beforeEach(function() {
      engine = new C.Engine();
      engine.processMoveLog(["1. Pe2-e4 Pe7-e5", "2. Bf1-d3 Kb8-c6", "3. Pa2-a4 Pa7-a5", "4. Pb2-b4 Pa5xb4", "5. Pa4-a5 Kc6xa5", "6. Bd3-c4 Bf8-d6", "7. Kg1-f3 Kg8-h6", "8. Ke1-e2 Kh6-g4", "9. Ke2-d3 Pf7-f5", "10. Pe4xf5 Pe5-e4"]);
   });

   afterEach(function() {
      engine = null;
   });

   var engine;

});