var webpack = require('webpack');
var manifestPlugin = require('webpack-manifest-plugin');
var _ = require('lodash');
var path = require('path');

var config = require('../config').webpack;
var webPackConfig = module.exports = require('./main.config.js');

webPackConfig.output = _.merge(config.output, {
    filename: config.production.filename
});

webPackConfig = _.merge(webPackConfig, {
    debug: false,
    displayErrorDetails: false,
    outputPathinfo: false,
    devtool: false
});

// Common chuncks
_.each(config.commons, function (common) {
    webPackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: common.name,
            filename: common.name + config.production.commonFilename,
            chunks: common.files
        })
    );
});

webPackConfig.plugins.push(
    new manifestPlugin({
        fileName: config.production.manifestFilename,
        stripSrc: '-[chunkhash].js'
    }),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        mangle: true,
        minimize: true,
        compress: {
            warnings: false
        }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
);
