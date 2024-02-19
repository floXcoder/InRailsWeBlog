const webpack = require('webpack');
const {merge} = require('webpack-merge');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('../config').webpack;
let mainConfig = require('./main.config');

const testConfig = {
    mode: 'development',

    output: {
        publicPath: config.test.assetPath,
        pathinfo: false, // Increase garbage collection used
        filename: config.test.filename + '.js',
        chunkFilename: config.test.chunkFilename + '.js'
    },

    cache: false,

    devtool: false,

    experiments: {
        backCompat: true,
        asyncWebAssembly: true,
        futureDefaults: false,
        layers: true,
        lazyCompilation: false,
        outputModule: false,
        syncWebAssembly: true,
        topLevelAwait: true
    },

    optimization: {
        // Active tree shaking
        sideEffects: true,

        emitOnErrors: true,
        noEmitOnErrors: false,
        concatenateModules: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,

        splitChunks: {
            chunks: 'async',
            minRemainingSize: 0,
            minSize: 50_000,
            minChunks: 2,
            maxInitialRequests: 20,
            maxAsyncRequests: 20,
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'initial',
                    priority: -10,
                    minChunks: 4,
                    reuseExistingChunk: true,
                    test(module) {
                        if (module.resource) {
                            return !module.resource.includes('/admin/') && !module.resource.includes('/admins/') && !module.resource.includes('admins-');
                        }
                    }
                }
            }
        }
    }
};

mainConfig = merge(mainConfig, testConfig);

mainConfig.plugins.push(
    new webpack.DefinePlugin({
        GlobalEnvironment: {
            NODE_ENV: JSON.stringify('test'),
            // ASSET_PATH: JSON.stringify(config.test.assetPath)
        }
    }),
    new CleanWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({
        debug: true
    }),
    new CopyWebpackPlugin({
        patterns: [{
            from: config.translations,
            to: 'translations/[path]' + config.test.filename + '[ext]', // keep directory tree
            toType: 'template'
        }]
    }),
    new CopyWebpackPlugin({
        patterns: config.fonts.map(config.fonts, (font) => ({
            from: font.from,
            to: font.to + config.test.filename + '[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: config.fonts.map((font) => ({
            from: font.from,
            to: font.to + config.test.filename + '[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: config.images.map((image) => ({
            from: image.from,
            to: image.to + '/' + config.test.filename + '[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: config.datas.map((data) => ({
            from: data.from,
            to: data.to + config.test.filename + '[ext]',
            toType: 'template'
        }))
    }),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: config.test.filename + '.css',
        chunkFilename: config.test.chunkFilename + '.css'
    })
);

module.exports = mainConfig;
