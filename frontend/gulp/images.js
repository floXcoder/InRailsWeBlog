var changed    = require('gulp-changed');
var gulp       = require('gulp');
var imageMin   = require('gulp-imagemin');
var browserSync = require('browser-sync');
var config     = require('../config').images;

// Move pictures to public directory
gulp.task('images', function () {
    return gulp.src(config.src)
        .pipe(changed(config.dest)) // Ignore unchanged files
        .pipe(imageMin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream:true}));
});
