const webpack = require('webpack');
const manifestPlugin = require('webpack-manifest-plugin');
const _ = require('lodash');

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config.js');

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.production.filename
});

webPackConfig = _.merge(webPackConfig, {
    // debug: false,
    // displayErrorDetails: false,
    output: {
        pathinfo: false
    },
    devtool: false
});

// Common chunks
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
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
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
        beautify: false,
        sourceMap: false,
        mangle: true,
        compress: {
            warnings: false,
            screw_ie8: true
        },
        comments: false
    }),
    new webpack.NoErrorsPlugin()
);
