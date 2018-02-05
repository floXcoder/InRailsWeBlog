const gulp = require('gulp');
const webpack = require('webpack');
const browserSync = require('browser-sync');

const logger = require('../../lib/compileLogger');
const webpackConfig = require('../../webpack/development.config.js');

gulp.task('webpack:development', (callback) => {
    var built = false;

    if (global.watch) {
        webpack(webpackConfig).watch(200, (err, stats) => {
            logger(err, stats);
            browserSync.reload();
            // On the initial compile, let gulp know the task is done
            if (!built) {
                built = true;
                callback();
            }
        });
    } else {
        webpack(webpackConfig, (err, stats) => {
            logger(err, stats);
            callback();
        });
    }
});
