const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

const autoprefixer = require('autoprefixer');

const HappyPack = require('happypack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('../config').webpack;

let webPackConfig = module.exports = {
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

webPackConfig.externals = config.externals;

webPackConfig.resolve = {
    // tell webpack which extensions to auto search when it resolves modules. With this,
    // you'll be able to do `require('./utils')` instead of `require('./utils.js')`
    extensions: ['.js', '.jsx'],
    // by default, webpack will search in `web_modules` and `node_modules`. Because we're using
    // vendor, we want it to look in there too
    modules: config.modules.includes,
    // Initialize aliases
    alias: {},
    symlinks: false // No use of yarn link
};

_.forEach(config.alias, (value, key) => {
    webPackConfig.resolve.alias[key] = path.resolve(value);
});

webPackConfig.module = {
    noParse: config.modules.noParse,
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: config.rules.javascript.exclude,
            loader: 'happypack/loader',
            options: config.rules.javascript.options
        },
        {
            test: /\.s?[ac]ss$/,
            exclude: config.rules.stylesheet.exclude,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: 'css-loader', // translates CSS into CommonJS
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [autoprefixer('last 2 version')]
                    }
                },
                {
                    loader: 'sass-loader', // compiles Sass to CSS
                    options: config.rules.stylesheet.options
                }
            ]
        },
        {
            test: /\.(gif|png|jpe?g|svg)$/i,
            exclude: config.rules.file.exclude,
            use: [
                'file-loader',
                {
                    loader: 'image-webpack-loader',
                    options: config.rules.file.options
                }
            ]
        },
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            exclude: config.rules.font.exclude,
            use: [{
                loader: 'file-loader',
                options: config.rules.font.options
            }]
        }
    ]
};

webPackConfig.plugins = [
    new HappyPack(config.happyPack),
    new webpack.ProvidePlugin(config.plugins),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
        from: 'images/favicon.ico',
        to: 'favicon.ico'
    }]),
    new LodashModuleReplacementPlugin({
        // 'currying': true,
        'caching': true,
        'collections': true,
        'flattening': true,
        'placeholders': true
    })
];

_.map(config.ignorePlugins, (ignore) => {
    webPackConfig.plugins.push(new webpack.IgnorePlugin(ignore));
});
