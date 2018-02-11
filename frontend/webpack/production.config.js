const _ = require('lodash');
const webpack = require('webpack');
const manifestPlugin = require('webpack-manifest-plugin');

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config.js');

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.production.filename
});

webPackConfig = _.merge(webPackConfig, {
    // debug: false,
    // displayErrorDetails: false,
    output: {
        pathinfo: false,
        chunkFilename: config.production.chunkFilename
    },
    devtool: false
});

// Common chunks
_.forEach(config.commons, (common) => {
    webPackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: common.name,
            filename: common.asyncName ? undefined : common.name + config.development.commonFilename,
            chunks: common.files,
            async: common.asyncName
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
        'global.WEBPACK': JSON.stringify(true),
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        },
        'NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        sourceMap: false,
        mangle: true,
        compress: {
            warnings: false,
            screw_ie8: true
        },
        comments: false
    })
);
