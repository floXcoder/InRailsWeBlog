const gulp = require('gulp');
const changed = require('gulp-changed');
const browserSync = require('browser-sync');
const config = require('../config').data;

// Move data to public directory
gulp.task('data', () =>
    gulp.src(config.src)
        .pipe(changed(config.dest)) // Ignore unchanged files
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream: true}))
);
