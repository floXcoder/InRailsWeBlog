const gulp = require('gulp');
const webpack = require('webpack');
const browserSync = require('browser-sync');
const logger = require('../lib/compileLogger');
const webpackConfig = require('../webpack/development.config.js');

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

    // Webpack dev server
    // Not working when running from file
    // Dev server must use from command line: ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --config webpack.config.js

    // Replace webpack output publicPath by:
    // output: {
    //     publicPath: 'http://localhost:8080/assets/',
    // },

    // Add to .babelrc :
    // "plugins": [
    //     "react-hot-loader/babel"
    // ],

    // Add to all entries:
    // config.entry.unshift('react-hot-loader/patch', 'webpack-dev-server/client?http://localhost:8080', 'webpack/hot/only-dev-server');

    // const path = require('path');
    // const WebpackDevServer = require('webpack-dev-server');
    //     try {
    //         const compiler = webpack(config);
    //
    //         const server = new WebpackDevServer(compiler, {
    //             contentBase: path.resolve('./public/assets'),
    //             publicPath: 'http://localhost:8080/assets/',
    //             port: 8080,
    //             historyApiFallback: true,
    //             hot: true,
    //             inline: true,
    //             // progress: true,
    //             // https://webpack.js.org/configuration/stats/
    //             stats: {
    //                 colors: true,
    //                 assets: false,
    //                 source: false,
    //                 timings: true,
    //                 hash: true,
    //                 version: true,
    //                 chunkModules: false,
    //                 chunkOrigins: true
    //             },
    //         });
    //
    //         server.listen(8080, '0.0.0.0', () => {
    //             console.log('Listening on port 8080');
    //         });
    //
    //     } catch (ex) {
    //         console.log(`The following error has occurred: ${ex}`);
    //     }
});
