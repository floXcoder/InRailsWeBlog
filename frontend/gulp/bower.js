var gulp = require('gulp');
var bower = require('gulp-bower');
var config = require('../config').bower;

// Bower task : run bower install
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.dest));
});
