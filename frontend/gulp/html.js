var gulp       = require('gulp');
var config     = require('../config').html;

// Move pictures to public directory
gulp.task('html', function () {
    //return gulp.src(config.src, { "base" : config.base })
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest));
});
