const gulp = require('gulp');
const browserSync = require('browser-sync');
const config = require('../config').views;

// Rails view files
gulp.task('views', () => browserSync.reload());
