const gulp = require('gulp');
const logger = require('../lib/compileLogger');
const webpack = require('webpack');

gulp.task('webpack:production', (callback) => {
    const webpackConfig = require('../webpack/production.config.js');

    webpack(webpackConfig, (err, stats) => {
        logger(err, stats);
        callback();
    });
});
