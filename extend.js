C.extend = function( cls, base ) {
   function F(){ }
   F.prototype = base.prototype;

   cls.prototype = new F();
   cls.prototype.constructor = cls;
   cls.superclass = base.prototype;

   return cls;
};