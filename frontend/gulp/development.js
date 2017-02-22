var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('development', function(callback) {
    gulpSequence('clean', ['fonts', 'images'], ['sass', 'webpack:development', 'views'], callback);
});
