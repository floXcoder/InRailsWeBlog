var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('default', function(callback) {
    gulpSequence('development', ['watch', 'browserSync'], callback);
});
