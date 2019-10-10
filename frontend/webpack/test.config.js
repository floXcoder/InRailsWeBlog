const _ = require('lodash');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config.js');

webPackConfig.mode = 'development';

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.test.filename + '.js'
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
        maxAsyncRequests: 8,
        maxInitialRequests: 5
    }
};

webPackConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('test'),
            'ASSET_PATH': JSON.stringify(config.test.assetPath.replace('PORT', process.env.TEST_PORT || 3000))
        }
    }),
    new webpack.LoaderOptionsPlugin({
        debug: true
    }),
    new CopyWebpackPlugin([{
        from: config.translations,
        to: 'translations/' + config.test.filename + '.[ext]',
        toType: 'template'
    }]),
    new CopyWebpackPlugin(_.map(config.images, (image) => ({
        from: image.from,
        to: image.to + '/' + config.test.filename + '.[ext]',
        toType: 'template'
    }))),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: config.test.filename + '.css',
        chunkFilename: config.test.chunkFilename + '.css'
    })
);
