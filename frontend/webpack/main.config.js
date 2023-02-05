const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('../config').webpack;

const webPackConfig = module.exports = {
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

// webPackConfig.externals = config.externals;

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

_.forEach(config.alias, (value, key) => webPackConfig.resolve.alias[key] = path.resolve(value));

webPackConfig.module = {
    // noParse: config.modules.noParse,
    rules: [
        {
            test: /\.(js|jsx)$/i,
            include: path.resolve(config.rules.javascript.include),
            loader: 'babel-loader',
            options: config.rules.javascript.options
        },
        {
            test: /\.s?[ac]ss$/i,
            exclude: config.rules.stylesheet.exclude,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader', // translates CSS into CommonJS
                    options: config.rules.stylesheet.options
                },
                // {
                //     loader: 'postcss-loader',
                //     options: {
                //         postcssOptions: {
                //             plugins: () => [autoprefixer('last 2 version')]
                //         }
                //     }
                // },
                {
                    loader: 'sass-loader', // compiles Sass to CSS, using Dart Sass
                    options: {
                        sassOptions: config.rules.sass.options
                    }
                }
            ]
        },
        {
            test: /\.(gif|png|jpe?g|svg)$/i,
            exclude: config.rules.file.exclude,
            use: [
                {
                    loader: 'image-webpack-loader',
                    options: config.rules.file.options
                }
            ],
            type: 'asset/resource'
        },
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
            exclude: config.rules.font.exclude,
            use: [
                {
                    loader: 'file-loader',
                    options: config.rules.font.options
                }
            ],
            type: 'asset/resource'
        }
    ]
};

const providePlugins = {};
_.forEach(config.plugins, (value, key) => {
    const pluginName = Array.isArray(value) ? value[0] : value;
    if (pluginName.includes('.js') || pluginName.includes('.jsx')) {
        return providePlugins[key] = Array.isArray(value) ? [path.resolve(pluginName), value[1]] : path.resolve(pluginName);
    } else {
        return providePlugins[key] = value;
    }
});

webPackConfig.plugins = [
    new webpack.ProvidePlugin(providePlugins),
    new CopyWebpackPlugin({
        patterns: [{
            from: 'images/favicon.ico',
            to: 'favicon.ico'
        }]
    })
];

// _.map(config.replacementPlugins, (context) => {
//     webPackConfig.plugins.push(new webpack.ContextReplacementPlugin(context[0], context[1]))
// });

// _.map(config.ignorePlugins, (ignore) => {
//     webPackConfig.plugins.push(new webpack.IgnorePlugin(ignore));
// });
