describe('Knight', function() {

   it('Can traverse the board legally', function() {
      expect(engine.checkLegal('b1', 'c3')).toBe(true);
      engine.makeMove('Nb1-c3');
      expect(engine.checkLegal('b8', 'a6')).toBe(true);
      engine.makeMove('Nb8-a6');
      expect(engine.checkLegal('c3', 'e4')).toBe(true);
      engine.makeMove('Nc3-e4');
      expect(engine.checkLegal('a6', 'c5')).toBe(true);
      engine.makeMove('Na6-c5');
      expect(engine.checkLegal('e4', 'g5')).toBe(true);
      engine.makeMove('Ne4-g5');
      expect(engine.checkLegal('c5', 'e4')).toBe(true);
      engine.makeMove('Nc5-e4');
      expect(engine.checkLegal('g5', 'h7')).toBe(true);
      engine.makeMove('Ng5xh7');
      expect(engine.checkLegal('e4', 'f2')).toBe(true);
      engine.makeMove('Ne4xf2');
      expect(engine.checkLegal('h7', 'f8')).toBe(true);
      engine.makeMove('Nh7xf8');
      expect(engine.checkLegal('f2', 'h1')).toBe(true);
      engine.makeMove('Nf2xh1');
   });

   it('Can\'t move illegally', function() {
      expect(engine.checkLegal('b1', 'b3')).toBe(false);
      engine.makeMove('Nb1-c3');
      expect(engine.checkLegal('g1', 'e3')).toBe(false);
      engine.makeMove('Nb8-c6');
      expect(engine.checkLegal('c3', 'c1')).toBe(false);
      engine.processMoveLog(["1. Pe2-e4 Pe7-e5", "2. Bf1-d3 Kb8-c6", "3. Pa2-a4 Pa7-a5", "4. Pb2-b4 Pa5xb4", "5. Pa4-a5 Kc6xa5", "6. Bd3-c4 Bf8-d6", "7. Kg1-f3 Kg8-h6", "8. Ke1-e2 Kh6-g4", "9. Ke2-d3 Pf7-f5", "10. Pe4xf5 Pe5-e4"]);
      expect(engine.checkLegal('f3', 'e4')).toBe(false);
      expect(engine.checkLegal('a6', 'c5')).toBe(false);
      expect(engine.checkLegal('e4', 'g5')).toBe(false);
      expect(engine.checkLegal('c5', 'e4')).toBe(false);
   });

   it('Can move from starting position', function() {
      expect(engine.checkLegal('b1', 'a3')).toBe(true);
      engine.makeMove('Nb1-c3');
      expect(engine.checkLegal('b8', 'a6')).toBe(true);
      engine.makeMove('Nb8-a6');
      expect(engine.checkLegal('g1', 'h3')).toBe(true);
      engine.makeMove('Ng1-h3');
      expect(engine.checkLegal('g8', 'h6')).toBe(true);
      engine.makeMove('Ng8-h6');
      engine = new C.Engine(); // resets board to starting pos
      expect(engine.checkLegal('b1', 'c3')).toBe(true);
      engine.makeMove('Nb1-c3');
      expect(engine.checkLegal('b8', 'c6')).toBe(true);
      engine.makeMove('Nb8-a6');
      expect(engine.checkLegal('g1', 'f3')).toBe(true);
      engine.makeMove('Ng1-h3');
      expect(engine.checkLegal('g8', 'f6')).toBe(true);
      engine.makeMove('Ng8-h6');
   });

   beforeEach(function() {
      engine = new C.Engine();
   });

   afterEach(function() {
      engine = null;
   });

   var engine;

});