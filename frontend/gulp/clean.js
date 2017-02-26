const gulp = require('gulp');
const rimraf = require('gulp-rimraf');
const config = require('../config');

gulp.task('clean', (callback) =>
    gulp.src(config.clean, {read: false}) // much faster
    //.pipe(ignore('node_modules/**'))
        .pipe(rimraf())
);
