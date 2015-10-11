var gulp            = require('gulp');
var webpack         = require('webpack');
var browserSync     = require('browser-sync');
var logger          = require('../lib/compileLogger');
var webpackConfig   = require('../webpack/development.config.js');

gulp.task('webpack:development', function(callback) {
    var built = false;

    webpack(webpackConfig).watch(200, function(err, stats) {
        logger(err, stats);
        browserSync.reload();
        // On the initial compile, let gulp know the task is done
        if(!built) { built = true; callback(); }
    });
});
