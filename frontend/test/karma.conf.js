var webpack = require('webpack');
var webPackConfig = module.exports = require('../webpack/test.config.js');

module.exports = function (config) {
    config.set({
        // base path
        basePath: '../..',

        browsers: ['FirefoxDeveloper'], //run in Firefox

        singleRun: false, //just run once by default

        frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'], //use the mocha test framework

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        files: [
            'frontend/test/tests.webpack.js', //just load this file
            {pattern: 'public/assets/**/*', included: false, served: true}
        ],

        proxies: {
            '/assets/': '/base/public/assets/'
        },

        plugins: [
            'karma-firefox-launcher',
            'karma-chrome-launcher',
            'karma-chai',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-sinon',
            'karma-sinon-chai',
            'karma-notify-reporter'
        ],

        preprocessors: {
            'frontend/test/tests.webpack.js': ['webpack', 'sourcemap'] //preprocess with webpack and our sourcemap loader
        },

        reporters: ['mocha', 'notify'], //report results in this format

        notifyReporter: {
            reportEachFailure: false, // Default: false, Will notify on every failed sepc
            reportSuccess: false // Default: true, Will notify when a suite was successful
        },

        webpack: webPackConfig,

        webpackMiddleware: {
            noInfo: true //please don't spam the console when running in karma!
        }
    });
};
