var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('development', function(callback) {
    gulpSequence('clean', ['fonts', 'images', 'html'], ['sass', 'webpack:development', 'views'], callback);
});
