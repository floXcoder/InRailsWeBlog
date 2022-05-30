const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const sane = require('sane');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config');

webPackConfig.mode = 'development';

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.development.filename + '.js'
});

webPackConfig = _.merge(webPackConfig, {
    output: {
        publicPath: config.development.assetPath,
        pathinfo: false, // Increase garbage collection used
        chunkFilename: config.development.chunkFilename + '.js'
    },

    cache: true,

    devtool: 'cheap-module-source-map',
    // devtool: 'eval',

    experiments: {
        asyncWebAssembly: true,
        layers: true,
        lazyCompilation: false,
        outputModule: true,
        syncWebAssembly: true,
        topLevelAwait: true
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

    devServer: {
        devMiddleware: {
            publicPath: config.development.assetPath,
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
            }
        },
        static: {
            directory: path.resolve('./public/assets'),
            publicPath: config.development.assetPath,
            watch: true,
            staticOptions: {
                ignored: /node_modules/
            }
        },
        port: 8080,
        https: false,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        hot: true,
        compress: true,
        historyApiFallback: {
            disableDotRule: true
        },
        client: {
            logging: 'warn',
            overlay: true,
            progress: true,
            webSocketURL: {
                hostname: '0.0.0.0',
                pathname: '/ws',
                port: 8080
            }
        },
        // Use sane to monitor all of the templates files and sub-directories
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            const watcher = sane(path.join(__dirname, '../..'), {
                glob: config.development.watchPath
            });
            watcher.on('change', function (/* filePath */) {
                // console.log('  File modified:', filePath);
                devServer.sendMessage(devServer.webSocketServer.clients, 'content-changed');
            });

            return middlewares;
        }
    }
});

webPackConfig.optimization = {
    // Active tree shaking
    sideEffects: true,

    emitOnErrors: true,
    concatenateModules: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,

    splitChunks: {
        chunks: 'async',
        minRemainingSize: 0,
        minSize: 100_000,
        minChunks: 2,
        maxInitialRequests: 12,
        maxAsyncRequests: 12,
        cacheGroups: {
            commons: {
                name: 'commons',
                chunks: 'initial',
                minChunks: 2,
                reuseExistingChunk: true,
                test(module) {
                    if (module.resource) {
                        return !module.resource.includes('/admin/') && !module.resource.includes('admin-');
                    }
                }
            }
        }
    }
};

webPackConfig.plugins.push(
    new webpack.DefinePlugin({
        GlobalEnvironment: {
            NODE_ENV: JSON.stringify('development'),
            ASSET_PATH: JSON.stringify(config.development.assetPath)
        }
    }),
    new CleanWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({
        debug: true
    }),
    new CopyWebpackPlugin({
        patterns: [{
            from: config.translations,
            to: 'translations/[path]/' + config.development.filename + '[ext]', // keep directory tree
            toType: 'template'
        }]
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.fonts, (font) => ({
            from: font.from,
            to: font.to + config.development.filename + '[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.images, (image) => ({
            from: image.from,
            to: image.to + '/' + config.development.filename + '[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.datas, (data) => ({
            from: data.from,
            to: data.to + config.development.filename + '[ext]',
            toType: 'template'
        }))
    }),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: config.development.filename + '.css',
        chunkFilename: config.development.chunkFilename + '.css'
    }),
    new ReactRefreshWebpackPlugin(),
    // new WorkboxPlugin.GenerateSW({
    //     swDest: config.serviceWorker.dest,
    //     inlineWorkboxRuntime: true,
    //     additionalManifestEntries: config.serviceWorker.additionalFiles,
    //     clientsClaim: true,
    //     skipWaiting: true,
    //     offlineGoogleAnalytics: false,
    //     maximumFileSizeToCacheInBytes: 4_000_000,
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
