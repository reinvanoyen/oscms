"use strict";

const gulp = require('gulp');

require('./gulp/watch');
require('./gulp/css');
require('./gulp/javascript');

// default
gulp.task( 'default', [ 'watch' ] );