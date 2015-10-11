var gulp   = require('gulp');
var rimraf    = require('gulp-rimraf');
var config = require('../config');

gulp.task('clean', function (callback) {
    return gulp.src(config.clean, { read: false }) // much faster
        //.pipe(ignore('node_modules/**'))
        .pipe(rimraf());
});
