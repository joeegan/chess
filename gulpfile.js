var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('default', function() {
   gulp.src([
         'lib/*.js',
         './namespace.js',
         './extend.js',
         './piece/piece.js',
         './piece/*.js',
         './engine.js',
         './movelog.js',
         './ui.js',
         './chess.js',
         ])
      .pipe(uglify())
      .pipe(concat("chess.js"))
      .pipe(gulp.dest('dist'));
});
