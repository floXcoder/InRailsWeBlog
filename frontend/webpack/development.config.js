var webpack = require('webpack');
var HappyPack = require('happypack');
var _ = require('lodash');

var config   = require('../config').webpack;
var webPackConfig = module.exports = require('./main.config.js');

webPackConfig.output = _.merge(config.output, {
    filename: config.development.filename
});

webPackConfig = _.merge(webPackConfig, {
    cache: true,
    debug: true,
    stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
    },
    displayErrorDetails: true,
    output: {
        pathinfo: true
    },
    devtool: 'source-map'
    // Firefox bug, try to load source map files
    // devtool: 'cheap-module-eval-source-map'
});

// Common chuncks
_.each(config.commons, function(common) {
    webPackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: common.name,
            filename: common.name + config.development.commonFilename,
            chunks: common.files
        })
    );
});

webPackConfig.plugins.push(
    new webpack.NoErrorsPlugin(),
    new HappyPack({
        id: 'jsx',
        loaders: [
            'babel?presets[]=es2015', 'babel?presets[]=react'
        ]
    })
);
