const webpack = require('webpack');
const HappyPack = require('happypack');
const _ = require('lodash');

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config.js');

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.development.filename
});

webPackConfig = _.merge(webPackConfig, {
    // debug: true,

    stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
    },

    // displayErrorDetails: true,

    output: {
        pathinfo: true
    },

    // devtool: 'source-map'
    devtool: 'cheap-module-source-map'
});

// Common chunks
_.each(config.commons, function (common) {
    webPackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: common.name,
            filename: common.name + config.development.commonFilename,
            chunks: common.files
        })
    );
});

webPackConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
        debug: true
    }),
    new webpack.NoErrorsPlugin(),
    new HappyPack(config.happyPack)

    // For webpack dev server:
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NamedModulesPlugin(),
);
