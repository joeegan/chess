describe('Pawn', function() {

   it('Can move forward 1 step on initial move', function() {
      expect(engine.checkLegal('e2', 'e3')).toBe(true);
   });

   it('Can move forward 2 steps on initial move', function() {
      expect(engine.checkLegal('e2', 'e4')).toBe(true);
   });

   it('Can\'t move forward 2 steps on advanced move', function() {
      engine.processMoveLog(['1. Pe2-e4 Pd7-d5']);
      expect(engine.checkLegal('e4', 'e6')).toBe(false);
   });

   it('Can\'t move forward 3 steps or more on initial move', function() {
      expect(engine.checkLegal('e2', 'e5')).toBe(false);
      expect(engine.checkLegal('e2', 'e6')).toBe(false);
      expect(engine.checkLegal('e2', 'e7')).toBe(false);
      expect(engine.checkLegal('e2', 'e8')).toBe(false);
   });

   it('Can\'t move diagonally in any direction from initial position', function() {
      expect(engine.checkLegal('e2', 'd1')).toBe(false);
      expect(engine.checkLegal('e2', 'f1')).toBe(false);
      expect(engine.checkLegal('e2', 'f3')).toBe(false);
      expect(engine.checkLegal('e2', 'd3')).toBe(false);
   });

   it('Can\'t move sideways', function() {
      expect(engine.checkLegal('e2', 'f2')).toBe(false);
      expect(engine.checkLegal('e2', 'd2')).toBe(false);
      engine.processMoveLog(['1. Pe2-e4 Pe7-e6']);
      expect(engine.checkLegal('e4', 'f4')).toBe(false);
      expect(engine.checkLegal('e4', 'd4')).toBe(false);
   });

   it('Can capture diagonally', function() {
      engine.processMoveLog(['1. Pe2-e4 Pd7-d5']);
      expect(engine.checkLegal('e4', 'd5')).toBe(true);
   });

   beforeEach(function() {
      engine = new C.Engine();
   });

   afterEach(function() {
      engine = null;
   });

   var engine;

});