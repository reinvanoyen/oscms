"use strict";

const gulp = require( 'gulp' );

gulp.task('watch', function() {

  gulp.watch( [ 'src/**/*.js' ], ['javascript'] );
  gulp.watch( [ 'index.scss', 'sass/**/*.scss', 'src/**/*.scss' ], ['css'] );
});