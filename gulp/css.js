"use strict";

const gulp = require('gulp'),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  base64 = require('gulp-base64'),
  sourcemaps = require('gulp-sourcemaps')
;

gulp.task( 'css', () => {

  return gulp.src( 'index.scss' )
    .pipe( plumber( { errorHandler: ( err ) => {
      console.log(err);
    } } ) )
    .pipe( sass() )
    .pipe( gulp.dest( 'build/css' ) )
  ;
} );