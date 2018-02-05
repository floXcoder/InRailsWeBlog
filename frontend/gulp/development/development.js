const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');

gulp.task('development', (callback) =>
    gulpSequence('clean', ['images', 'fonts', 'data', 'sass:development', 'webpack:development', 'views'], callback)
);
