var gulp         = require('gulp');
var cache        = require('gulp-cached');
var sass         = require('gulp-sass');
var sourceMaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync');

var handleErrors = require('../lib/handleErrors');
var config       = require('../config').sass;

gulp.task('sass', function () {
    return gulp.src(config.src)
        .pipe(cache('sass'))
        .pipe(sourceMaps.init())
        .pipe(sass(config.settings))
        .on('error', handleErrors)
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream:true}));
});
