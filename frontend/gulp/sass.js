const gulp = require('gulp');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');

const handleErrors = require('../lib/handleErrors');
const config = require('../config').sass;

gulp.task('sass', () =>
    gulp.src(config.src)
        .pipe(sourceMaps.init())
        .pipe(sass(config.settings))
        .on('error', handleErrors)
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream: true}))
);
