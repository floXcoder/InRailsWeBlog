const _ = require('lodash');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config.js');

webPackConfig.mode = 'production';

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.production.filename + '.js'
});

webPackConfig = _.merge(webPackConfig, {
    output: {
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

    devtool: false
});

// Configuration options: https://github.com/webpack/webpack/blob/master/schemas/WebpackOptions.json#L1285
webPackConfig.optimization = {
    flagIncludedChunks: true,
    occurrenceOrder: true,
    sideEffects: false, // => incompatible with I18n module
    providedExports: true,
    usedExports: true,
    concatenateModules: true,
    minimize: true,
    noEmitOnErrors: true,
    namedModules: false,
    namedChunks: false,
    nodeEnv: 'production',
    mangleWasmImports: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    runtimeChunk: {
        name: 'runtime'
    },
    splitChunks: {
        name: true,
        minChunks: 2,
        maxAsyncRequests: 8,
        maxInitialRequests: 5
        // JS not working if cacheGroups
        // cacheGroups: {
        //     styles: {
        //         name: 'styles',
        //         test: /\.css$/,
        //         chunks: 'all',
        //         enforce: true
        //     }
        // }
    },
    minimizer: [
        new UglifyJsPlugin({
            parallel: true,
            cache: true,
            sourceMap: false,
            uglifyOptions: {
                ecma: 5,
                output: {
                    comments: false
                },
                compress: {
                    dead_code: false,
                    drop_console: true,
                    warnings: true
                }
            }
        }),
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {discardComments: {removeAll: true}},
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
    new CopyWebpackPlugin([{
        from: config.translations,
        to: 'translations/' + config.production.filename + '.[ext]',
        toType: 'template'
    }]),
    new CopyWebpackPlugin(_.map(config.images, (image) => ({
        from: image.from,
        to: image.to + '/' + config.production.filename + '.[ext]',
        toType: 'template'
    }))),
    new webpack.HashedModuleIdsPlugin(),
    new ManifestPlugin({
        fileName: config.production.manifestFilename,
        map: (file) => {
            // Remove hash in manifest key
            file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2');
            return file;
        }
    }),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: config.production.filename + '.css',
        chunkFilename: config.production.chunkFilename + '.css'
    })
);
