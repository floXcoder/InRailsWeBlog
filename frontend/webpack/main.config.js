var path     = require('path');
var webpack  = require('webpack');
var config   = require('../config').webpack;

var webPackConfig = module.exports = {
    // the base path which will be used to resolve entry points
    context: path.resolve(config.context)
};

// the main entry point for our application's frontend JS
// The important thing to note is that this entry file is the “core” of your frontend JS, i.e. anything not required by this file (or a dependency of something which is required) will never end up in the compiled bundle.
webPackConfig.entry = config.entries;

webPackConfig.output = {
    // this is our app/assets/javascripts directory, which is part of the Sprockets pipeline
    path: path.resolve(config.output.path),
    // the filename of the compiled bundle, e.g. app/assets/javascripts/bundle.js
    //filename: config.development.filename,
    // if the webpack code-splitting feature is enabled, this is the path it'll use to download bundles
    publicPath: config.output.publicPath
};

webPackConfig.resolve = {
    // tell webpack which extensions to auto search when it resolves modules. With this,
    // you'll be able to do `require('./utils')` instead of `require('./utils.js')`
    extensions: ['', '.js', '.coffee'],
    // by default, webpack will search in `web_modules` and `node_modules`. Because we're using
    // Bower, we want it to look in there too
    modulesDirectories: config.modules.includes
};

webPackConfig.plugins = [
    // we need this plugin to teach webpack how to find module entry points for bower files,
    // as these may not have a package.json file
    new webpack.ResolverPlugin([
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
    ]),
    new webpack.ProvidePlugin(config.plugins),
    // Do not load all locales for moment.js
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/)
];

webPackConfig.module = {
    noParse: [
        //path.join(__dirname, 'vendor', 'assets', 'javascripts', 'revolution-slider')
    ],
    loaders: [
        {
            test: /\.coffee$/, loader: 'coffee-loader',
            exclude: /node_modules/
        },
        {
            test: path.resolve(config.context + '/app.js'),
            loader: 'expose?$app'
        }
    ]
};
