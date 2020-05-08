const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const sane = require('sane');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config.js');

webPackConfig.mode = 'development';

webPackConfig.resolve.alias['react-dom'] = path.resolve('node_modules/@hot-loader/react-dom');

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.development.filename + '.js'
});

webPackConfig.module.rules[1].use[0].options = {
    hmr: true
};

webPackConfig = _.merge(webPackConfig, {
    output: {
        publicPath: config.development.assetPath,
        pathinfo: false, // Increase garbage collection used
        chunkFilename: config.development.chunkFilename + '.js'
    },

    cache: true,

    devtool: 'cheap-module-source-map',
    // devtool: 'eval',

    stats: {
        colors: true,
        warnings: true,
        errors: true,
        errorDetails: true,
        assets: false,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        publicPath: false
    },

    devServer: {
        clientLogLevel: 'info',
        contentBase: path.resolve('./public/assets'),
        publicPath: config.development.assetPath,
        port: 8080,
        https: false,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        hot: true,
        inline: true,
        overlay: true,
        compress: true,
        disableHostCheck: true,
        useLocalIp: false,
        quiet: false,
        watchOptions: {
            ignored: /node_modules/
        },
        historyApiFallback: {
            disableDotRule: true
        },
        stats: {
            colors: true,
            warnings: true,
            errors: true,
            errorDetails: true,
            assets: false,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            publicPath: false
        },
        // Use sane to monitor all of the templates files and sub-directories
        before: (app, server) => {
            const watcher = sane(path.join(__dirname, '../..'), {
                glob: config.development.watchPath
            });
            watcher.on('change', function (filePath, root, stat) {
                console.log('  File modified:', filePath);
                server.sockWrite(server.sockets, "content-changed");
            });
        }
    }
});

webPackConfig.optimization = {
    // Active tree shaking
    // sideEffects: true,

    namedModules: true,
    noEmitOnErrors: false,
    concatenateModules: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    // runtimeChunk: {
    //     name: 'runtime'
    // },
    splitChunks: {
        chunks: 'async',
        minSize: 80000,
        maxSize: 0,
        minChunks: 2,
        maxAsyncRequests: 3,
        maxInitialRequests: 2,
        name: true,
        cacheGroups: {
            default: false,
            commonsAdmins: {
                name: 'admins-commons',
                minChunks: 2,
                reuseExistingChunk: true,
                chunks: function (chunk) {
                    return chunk.name.includes('admin');
                }
            },
            commons: {
                name: 'commons',
                minChunks: 2,
                reuseExistingChunk: true,
                chunks: function (chunk) {
                    return chunk.name === 'home' || chunk.name === 'user';
                }
            }
        }
    }
};

webPackConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('development'),
            'ASSET_PATH': JSON.stringify(config.development.assetPath)
        }
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
        debug: true
    }),
    new CopyWebpackPlugin([{
        from: config.translations,
        to: 'translations/' + config.development.filename + '.[ext]',
        toType: 'template'
    }]),
    new CopyWebpackPlugin(_.map(config.images, (image) => ({
        from: image.from,
        to: image.to + '/' + config.development.filename + '.[ext]',
        toType: 'template'
    }))),
    new CopyWebpackPlugin(_.map(config.datas, (data) => ({
        from: data.from,
        to: data.to + config.development.filename + '.[ext]',
        toType: 'template'
    }))),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: config.development.filename + '.css',
        chunkFilename: config.development.chunkFilename + '.css'
    }),
    // new WorkboxPlugin.GenerateSW({
    //     additionalManifestEntries: config.serviceWorker.additionalFiles,
    //     clientsClaim: true,
    //     skipWaiting: true,
    //     offlineGoogleAnalytics: false,
    //     maximumFileSizeToCacheInBytes: 4_000_000,
    //     swDest: config.serviceWorker.dest,
    //     exclude: config.serviceWorker.exclude,
    //     runtimeCaching: config.serviceWorker.runtimeCaching,
    //     // navigateFallback: config.serviceWorker.offlineFile,
    //     // navigateFallbackDenylist: config.serviceWorker.offlineExclude
    // }),
    // new BundleAnalyzerPlugin({
    //     // Can be `server`, `static` or `disabled`.
    //     // In `server` mode analyzer will start HTTP server to show bundle report.
    //     // In `static` mode single HTML file with bundle report will be generated.
    //     // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
    //     analyzerMode: 'server',
    //     // Host that will be used in `server` mode to start HTTP server.
    //     analyzerHost: '127.0.0.1',
    //     // Port that will be used in `server` mode to start HTTP server.
    //     analyzerPort: 8888,
    //     // Path to bundle report file that will be generated in `static` mode.
    //     // Relative to bundles output directory.
    //     reportFilename: 'report.html',
    //     // Module sizes to show in report by default.
    //     // Should be one of `stat`, `parsed` or `gzip`.
    //     // See "Definitions" section for more information.
    //     defaultSizes: 'parsed',
    //     // Automatically open report in default browser
    //     openAnalyzer: true,
    //     // If `true`, Webpack Stats JSON file will be generated in bundles output directory
    //     generateStatsFile: false,
    //     // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
    //     // Relative to bundles output directory.
    //     statsFilename: 'stats.json',
    //     // Options for `stats.toJson()` method.
    //     // For example you can exclude sources of your modules from stats file with `source: false` option.
    //     // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
    //     statsOptions: null,
    //     // Log level. Can be 'info', 'warn', 'error' or 'silent'.
    //     logLevel: 'info'
    // })
);
