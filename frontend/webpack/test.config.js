const _ = require('lodash');
const webpack = require('webpack');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config.js');

webPackConfig.mode = 'development';

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.test.filename + '.js'
});

webPackConfig.optimization = {
    emitOnErrors: true,
    concatenateModules: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,

    splitChunks: {
        chunks: 'initial',
        minRemainingSize: 0,
        minSize: 100_000,
        minChunks: 2,
        maxInitialRequests: 12,
        maxAsyncRequests: 12
    }
};

webPackConfig.plugins.push(
    new webpack.DefinePlugin({
        'js_environment': {
            'NODE_ENV': JSON.stringify('test'),
            'ASSET_PATH': JSON.stringify(config.test.assetPath)
        }
    }),
    new CleanWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({
        debug: true
    }),
    new CopyWebpackPlugin({
        patterns: [{
            from: config.translations,
            to: 'translations/[path]/' + config.development.filename + '.[ext]', // keep directory tree
            toType: 'template'
        }]
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.fonts, (font) => ({
            from: font.from,
            to: font.to + config.test.filename + '.[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.fonts, (font) => ({
            from: font.from,
            to: font.to + config.test.filename + '.[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.images, (image) => ({
            from: image.from,
            to: image.to + '/' + config.test.filename + '.[ext]',
            toType: 'template'
        }))
    }),
    new CopyWebpackPlugin({
        patterns: _.map(config.datas, (data) => ({
            from: data.from,
            to: data.to + config.test.filename + '.[ext]',
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
