var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('default', function(callback) {
    global.watch = true;
    gulpSequence('development', ['watch', 'browserSync'], callback);
});
