var gulp       = require('gulp');
var browserSync = require('browser-sync');
var config     = require('../config').views;

// Rails view files
gulp.task('views', function () {
    browserSync.reload();
});
