const _ = require('lodash');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
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
    occurrenceOrder: true,
    providedExports: true,
    sideEffects: true,
    usedExports: true,
    concatenateModules: true,
    minimize: true,
    noEmitOnErrors: true,
    namedModules: false,
    namedChunks: false,
    checkWasmTypes: true,
    mangleWasmImports: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    // runtimeChunk: {
    //     name: 'runtime'
    // },
    splitChunks: {
        hidePathInfo: true,
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
                // chunks: 'initial',
                chunks: function (chunk) {
                    return chunk.name.includes('admin');
                }
                // test: function (module, chunks) {
                //     if(chunks[0] && chunks[0].name) {
                //         return chunks[0].name.includes('admin');
                //     } else {
                //         return false;
                //     }
                // }
            },
            commons: {
                name: 'commons',
                minChunks: 2,
                reuseExistingChunk: true,
                // chunks: 'initial',
                chunks: function (chunk) {
                    return chunk.name === 'home' || chunk.name === 'user';
                }
                // test: function (module, chunks) {
                //     if(chunks[0] && chunks[0].name) {
                //         return !chunks[0].name.includes('admin');
                //     } else {
                //         return false;
                //     }
                // }
            }
        }
    },
    minimizer: [
        new TerserPlugin({
            parallel: true,
            sourceMap: true,
            cache: true,
            terserOptions: {
                ecma: 5,
                warnings: false,
                parse: {},
                compress: {},
                mangle: true,
                module: false,
                toplevel: false,
                nameCache: null,
                ie8: false,
                keep_classnames: undefined,
                keep_fnames: false,
                safari10: true,
                output: {
                    comments: false
                }
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
        'process.env': {
            'NODE_ENV': JSON.stringify('production'),
            'ASSET_PATH': JSON.stringify(config.production.assetPath)
        },
        'NODE_ENV': JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
    new CopyWebpackPlugin(_.map(config.images, (image) => ({
        from: image.from,
        to: image.to + '/' + config.production.filenameImage + '.[ext]',
        toType: 'template'
    }))),
    new CopyWebpackPlugin([{
        from: config.translations,
        to: 'translations/' + config.production.filename + '.[ext]',
        toType: 'template'
    }]),
    new CopyWebpackPlugin(_.map(config.datas, (data) => ({
        from: data.from,
        to: data.to + config.production.filename + '.[ext]',
        toType: 'template'
    }))),
    new webpack.HashedModuleIdsPlugin(),
    new ManifestPlugin({
        fileName: config.production.manifestFilename,
        map: (file) => {
            // Remove hash in manifest key
            file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2');
            // Correct incorrect font path
            const fontFile = file.path.match(/\/assets\/fonts\/(.*?)\.\w+\.(.*?)$/);
            if (fontFile) {
                file.name = fontFile[1] + '.' + fontFile[2];
            }
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
