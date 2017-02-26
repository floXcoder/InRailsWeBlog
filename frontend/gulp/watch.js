const gulp = require('gulp');
const watch = require('gulp-watch');
const config = require('../config');

gulp.task('watch', () => {
    watch(config.images.src, () => {
        gulp.start('images');
    });
    watch(config.sprites.src, () => {
        gulp.start('sprites');
    });
    watch(config.sass.src, () => {
        gulp.start('sass');
    });
    //watch(config.fonts.src, function() { gulp.start('fonts'); });
    //watch(config.data.src, function() { gulp.start('data'); });
    watch(config.views.src, () => {
        gulp.start('views');
    });
});
