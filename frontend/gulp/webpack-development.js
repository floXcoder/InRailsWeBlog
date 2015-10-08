var gulp            = require('gulp');
var webpack         = require('webpack');
var browserSync     = require('browser-sync');

var logger          = require('../lib/compileLogger');

gulp.task('webpack:development', function(callback) {
    var webpackConfig   = require('../webpack/development.config.js');

    var built = false;

    if(global.watch) {
        webpack(webpackConfig).watch(200, function(err, stats) {
            logger(err, stats);
            browserSync.reload();
            // On the initial compile, let gulp know the task is done
            if(!built) { built = true; callback(); }
        });
    } else {
        webpack(webpackConfig, function(err, stats) {
            logger(err, stats);
            callback();
        });
    }
});
