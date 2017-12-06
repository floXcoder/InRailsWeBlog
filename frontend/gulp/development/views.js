const gulp = require('gulp');
const browserSync = require('browser-sync');

// Rails view files
gulp.task('views', () => browserSync.reload());
