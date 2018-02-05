const gulp = require('gulp');
const webpack = require('webpack');

const logger = require('../../lib/compileLogger');
const webpackConfig = require('../../webpack/production.config.js');

gulp.task('webpack:production', (callback) => {
    webpack(webpackConfig, (err, stats) => {
        logger(err, stats);
        callback();
    });
});
