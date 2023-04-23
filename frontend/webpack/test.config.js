const _ = require('lodash');
const webpack = require('webpack');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config');

webPackConfig.mode = 'development';

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.test.filename + '.js'
});

webPackConfig = _.merge(webPackConfig, {
    output: {
        publicPath: config.test.assetPath,
        pathinfo: false, // Increase garbage collection used
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
        outputModule: true,
        syncWebAssembly: true,
        topLevelAwait: true
    }
});

webPackConfig.plugins.push(
    new webpack.DefinePlugin({
        GlobalEnvironment: {
            NODE_ENV: JSON.stringify('test'),
            ASSET_PATH: JSON.stringify(config.test.assetPath)
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
        patterns: _.map(config.fonts, (font) => ({
            from: font.from,
            to: font.to + config.test.filename + '[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.fonts, (font) => ({
            from: font.from,
            to: font.to + config.test.filename + '[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.images, (image) => ({
            from: image.from,
            to: image.to + '/' + config.test.filename + '[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.datas, (data) => ({
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
