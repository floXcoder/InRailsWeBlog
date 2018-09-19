const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config.js');

webPackConfig.mode = 'development';

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.development.filename + '.js'
});

webPackConfig = _.merge(webPackConfig, {
    output: {
        publicPath: config.development.assetPath,
        pathinfo: true,
        chunkFilename: config.development.chunkFilename + '.js'
    },

    cache: true,

    devtool: 'cheap-module-source-map',

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
        contentBase: path.resolve('./public/assets'),
        publicPath: config.development.assetPath,
        https: false,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        hot: true, // Hot react not fully working now
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
        }
    }
});

webPackConfig.optimization = {
    namedModules: true,
    noEmitOnErrors: false,
    concatenateModules: false,
    runtimeChunk: {
        name: 'runtime'
    },
    splitChunks: {
        // chunks: 'async', // 'all' : not working
        name: true,
        minChunks: 2,
        maxAsyncRequests: 5,
        maxInitialRequests: 3
    }
};

webPackConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('development'),
            'ASSET_PATH': JSON.stringify(config.development.assetPath)
        }
    }),
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
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: config.development.filename + '.css',
        chunkFilename: config.development.chunkFilename + '.css'
    }),
    // new webpack.HotModuleReplacementPlugin(),
    // new BrowserSyncPlugin(config.browserSync),
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
