var gulp       = require('gulp');
var changed = require('gulp-changed');
var browserSync = require('browser-sync');
var config     = require('../config').fonts;

// Move fonts to public directory
gulp.task('fonts', function () {
    return gulp.src(config.src)
        .pipe(changed(config.dest)) // Ignore unchanged files
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream:true}));
});
