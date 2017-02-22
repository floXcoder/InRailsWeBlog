var changed     = require('gulp-changed');
var gulp        = require('gulp');
var gm          = require('gulp-gm');
var browserSync = require('browser-sync');
var config      = require('../config').images;

// Move pictures to public directory
gulp.task('images', function () {
    return gulp.src(config.src)
        .pipe(changed(config.dest)) // Ignore unchanged files
        .pipe(gm(function (gmfile) {
            return gmfile.resize(1920, 1080, '>').interlace('Plane').quality(75).bitdepth(8).strip();
        }, {
            imageMagick: true
        }))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream: true}));
});
