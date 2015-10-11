var webpack = require('webpack');
var _ = require('lodash');

var config   = require('../config').webpack;
var webPackConfig = module.exports = require('./main.config.js');

webPackConfig.output = _.merge(config.output, {
    filename: config.development.filename
});

webPackConfig = _.merge(webPackConfig, {
    debug: true,
    displayErrorDetails: true,
    outputPathinfo: true,
    devtool: 'sourcemap'
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
    new webpack.NoErrorsPlugin()
);
