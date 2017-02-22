var gulp     = require('gulp');
var watch    = require('gulp-watch');
var config   = require('../config');

gulp.task('watch', function() {
    watch(config.images.src, function() { gulp.start('images'); });
    watch(config.sass.src, function() { gulp.start('sass'); });
    watch(config.views.src, function() { gulp.start('views'); });
});
