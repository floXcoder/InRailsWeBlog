const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');

gulp.task('development', (callback) =>
    gulpSequence('clean', ['fonts', 'images', 'sprites', 'data'], ['sass', 'webpack:development', 'views'], callback)
);
