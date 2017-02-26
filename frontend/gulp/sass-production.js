const gulp = require('gulp');
const sass = require('gulp-sass');
const handleErrors = require('../lib/handleErrors');
const config = require('../config').sass;

gulp.task('sass-production', () =>
    gulp.src(config.src)
        .pipe(sass(config.settings))
        .on('error', handleErrors)
        .pipe(gulp.dest(config.dest))
);
