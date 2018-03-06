"use strict";

const gulp = require( 'gulp' );

gulp.task('watch', function() {

  gulp.watch( [ 'index.js', 'components/**/*.js' ], ['javascript'] );
  gulp.watch( [ 'index.scss', 'sass/**/*.scss', 'components/**/*.scss' ], ['css'] );
});