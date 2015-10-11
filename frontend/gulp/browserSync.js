var browserSync = require('browser-sync');
var gulp        = require('gulp');
var config     = require('../config').browserSync;

gulp.task('browserSync', function() {

    //var webpackDevMiddleware = require('webpack-dev-middleware');
    //var webpackHotMiddleware = require('webpack-hot-middleware');
    //var bundler = webpack(webpackConfig);
    //var browserSyncConfig = {
    //    proxy: {
    //        target: 'http://localhost:3001',
    //        middleware: [
    //            webpackDevMiddleware(bundler, {
    //                // IMPORTANT: dev middleware can't access config, so we should
    //                // provide publicPath by ourselves
    //                publicPath: webpackConfig.output.publicPath,
    //
    //                // pretty colored output
    //                stats: { colors: true }
    //
    //                // for other settings see
    //                // http://webpack.github.io/docs/webpack-dev-middleware.html
    //            }),
    //
    //            // bundler should be the same as above
    //            webpackHotMiddleware(bundler)
    //        ]
    //    },
    //    notify: true,
    //    open: false
    //};

    return browserSync(config);
});
