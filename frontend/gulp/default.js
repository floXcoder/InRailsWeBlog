const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');

gulp.task('default', (callback) => {
    global.watch = true;
    gulpSequence('development', ['watch', 'browserSync'], callback);
});
