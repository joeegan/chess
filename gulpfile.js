var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('default', function() {
   gulp.src([
         'src/lib/*.js',
         'src/namespace.js',
         'src/extend.js',
         'src/piece/piece.js',
         'src/piece/*.js',
         'src/engine.js',
         'src/movelog.js',
         'src/ui.js',
         'src/chess.js',
         ])
      .pipe(uglify())
      .pipe(concat("chess.js"))
      .pipe(gulp.dest('dist'));
});
