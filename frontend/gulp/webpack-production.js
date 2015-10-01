var gulp            = require('gulp');
var logger          = require('../lib/compileLogger');
var webpack         = require('webpack');

gulp.task('webpack:production', function(callback) {
    var webpackConfig   = require('../webpack/production.config.js');

    webpack(webpackConfig, function(err, stats) {
        logger(err, stats);
        callback();
    });
});
