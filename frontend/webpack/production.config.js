const _ = require('lodash');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config.js');

webPackConfig.mode = 'production';

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.production.filename + '.js'
});

webPackConfig = _.merge(webPackConfig, {
    output: {
        publicPath: config.production.assetPath, // Used this url for fetching chunks or prefetch
        pathinfo: false,
        chunkFilename: config.production.chunkFilename + '.js'
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
        publicPath: true
    },

    bail: true,

    devtool: 'source-map'
});

// Configuration options: https://github.com/webpack/webpack/blob/master/schemas/WebpackOptions.json#L1285
webPackConfig.optimization = {
    nodeEnv: 'production',
    flagIncludedChunks: true,
    providedExports: true,
    sideEffects: true,
    usedExports: true,
    concatenateModules: true,
    minimize: true,
    emitOnErrors: false,
    checkWasmTypes: true,
    mangleWasmImports: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    splitChunks: {
        hidePathInfo: true,
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
    },
    minimizer: [
        new TerserPlugin({
            parallel: true,
            terserOptions: {
                ecma: 5,
                parse: {},
                compress: {},
                mangle: true, // Note `mangle.properties` is `false` by default.
                module: false
            }
        }),
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        })
    ]
};

webPackConfig.plugins.push(
    new webpack.DefinePlugin({
        'global.WEBPACK': JSON.stringify(true),
        'js_environment': {
            'NODE_ENV': JSON.stringify('production'),
            'ASSET_PATH': JSON.stringify(config.production.assetPath)
        },
        'NODE_ENV': JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
    new CopyWebpackPlugin({
        patterns: [{
            from: config.translations,
            to: 'translations/' + config.production.filename + '.[ext]',
            toType: 'template'
        }]
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.fonts, (font) => ({
            from: font.from,
            to: font.to + config.production.filenameFont + '.[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.images, (image) => ({
            from: image.from,
            to: image.to + '/' + config.production.filenameImage + '.[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.datas, (data) => ({
            from: data.from,
            to: data.to + config.production.filename + '.[ext]',
            toType: 'template'
        }))
    }),
    new webpack.ids.HashedModuleIdsPlugin(),
    new WebpackManifestPlugin({
        fileName: config.production.manifestFilename,
        map: (file) => {
            console.log(file)
            // Rename name key
            file.name = file.name.replace(/^javascripts\//, '');
            file.name = file.name.replace(/^images\//, '');
            file.name = file.name.replace(/^data\//, '');
            file.name = file.name.replace(/^fonts\/\w+\//, 'fonts/');
            return file;
        }
    }),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: config.production.filename + '.css',
        chunkFilename: config.production.chunkFilename + '.css'
    }),
    new WorkboxPlugin.GenerateSW({
        additionalManifestEntries: config.serviceWorker.additionalFiles,
        clientsClaim: true,
        skipWaiting: true,
        offlineGoogleAnalytics: false,
        maximumFileSizeToCacheInBytes: 1_200_000,
        swDest: config.serviceWorker.dest,
        exclude: config.serviceWorker.exclude,
        runtimeCaching: config.serviceWorker.runtimeCaching,
        // navigateFallback: config.serviceWorker.offlineFile,
        // navigateFallbackDenylist: config.serviceWorker.offlineExclude
    }),
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
