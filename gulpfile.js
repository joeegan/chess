var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var notify = require('gulp-notify');

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
      .pipe(gulp.dest('dist'))
      .pipe(notify({ message: "Javascript is now uglified and compressed"}));
});
