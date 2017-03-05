const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');

gulp.task('development', (callback) =>
    // 'sprites'
    gulpSequence('clean', ['fonts', 'images', 'data', 'sass', 'webpack:development', 'views'], callback)
);
