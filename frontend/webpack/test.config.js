const _ = require('lodash');

const config = require('../config').webpack;
let webPackConfig = module.exports = require('../webpack/main.config.js');

webPackConfig = _.merge(webPackConfig, {
    devtool: 'inline-source-map',
    externals: _.merge(webPackConfig.externals, {
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
    })
});

webPackConfig.module.loaders.push({
    test: /sinon\.js$/,
    loader: 'imports?define=>false,require=>false'
});

webPackConfig.resolve.extensions.push('.json');

webPackConfig = _.merge(webPackConfig.resolve, {
    alias: {
        'sinon': 'sinon/pkg/sinon'
    }
});
