"use strict";

const gulp = require('gulp'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  rev = require('gulp-rev'),
  source = require('vinyl-source-stream'),
  uglify = require('gulp-uglify')
;

gulp.task('javascript', () => {

  return browserify('index.js')
    .transform('babelify', {
      presets: ['es2015'],
      plugins: [
        ['transform-react-jsx', {pragma: 'ponnie.vnode'}]
      ]
    } )
    .bundle()
    .pipe( source('bundle.js') )
    .pipe( gulp.dest('build/js') )
  ;
});