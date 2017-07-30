const _ = require('lodash');
const webpack = require('webpack');
const HappyPack = require('happypack');

const config = require('../config').webpack;
let webPackConfig = module.exports = require('./main.config.js');

webPackConfig.output = _.merge(webPackConfig.output, {
    filename: config.development.filename
});

webPackConfig = _.merge(webPackConfig, {
    // debug: true,
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

    // displayErrorDetails: true,
    output: {
        pathinfo: true
    },

    // devtool: 'source-map'
    devtool: 'cheap-module-source-map'
});

webPackConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
        debug: true
    }),
    new HappyPack(config.happyPack)

    // For webpack dev server:
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NamedModulesPlugin(),
);

// Common chunks
_.forEach(config.commons, (common) => {
    webPackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: common.name,
            filename: common.name + config.development.commonFilename,
            chunks: common.files
        })
    );
});
