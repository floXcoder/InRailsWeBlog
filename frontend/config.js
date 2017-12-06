const publicDir = './public';
const assetDir = './app/assets';
const vendorDir = './vendor/assets';
const frontendDir = './node_modules';

module.exports = {
    webpack: {
        context: './app/assets/javascripts',
        entries: {
            ie8: ['./modules/ie8.js'],
            ie9: ['./modules/ie9.js'],
            home: ['./pages/home/home.jsx'],
            'users/show': ['./pages/users/show.jsx'],
            'users/edit': ['./pages/users/edit.jsx'],
            'users/login': ['./pages/users/login.jsx'],
            'users/signup': ['./pages/users/signup.jsx'],
            'users/password': ['./pages/users/password.jsx'],
            'articles/show': ['./pages/articles/show.jsx'],
            'articles/edit': ['./pages/articles/edit.jsx'],
            'tags/show': ['./pages/tags/show.jsx'],
            'errors/error': ['./pages/errors/error.jsx'],
            // 'admin/dashboard': ['./pages/admin/dashboard.jsx'],
            // 'admin/users/index': ['./pages/admin/managers/index.jsx'],
            // 'admin/users/show': ['./pages/admin/managers/show.jsx'],
            // 'admin/errors': ['./pages/admin/managers/errors.jsx']
        },

        commons: [
            {
                name: 'commons',
                files: [
                    'home',
                    'users/show', 'users/edit',
                    'articles/show', 'articles/edit',
                    'tags/show'
                ]
            },
            {
                name: 'commons-full-page',
                files: [
                    'users/login', 'users/signup', 'users/password', 'errors/error'
                ]
            },
            {
                name: 'commons-admin',
                files: [
                    'admin/dashboard',
                    'admin/users/index',
                    'admin/users/show',
                    'admin/errors'
                ]
            }
        ],
        output: {
            path: './public/assets',
            publicPath: '/assets/'
        },
        modules: {
            includes: [
                'node_modules'
            ],
            // noParse: []
        },
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules\/(?!(materialize-css)\/).*/,
                loader: 'babel-loader',
                options: {
                    babelrc: true,
                    cacheDirectory: true
                }
            }
        ],
        alias: {
            react: 'node_modules/react',
            jquery: 'node_modules/jquery/dist/jquery'
        },
        plugins: {
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery',
            "window.$": 'jquery',
            "window.jQuery": 'jquery',
            log: 'loglevel',
            React: 'react',
            ReactDOM: 'react-dom',
            PropTypes: 'prop-types',
            connect: ['react-redux', 'connect'],
            classNames: 'classnames',
            Promise: 'promise-polyfill',
            "window.Promise": 'promise-polyfill',
            "global.Promise": 'promise-polyfill'
        },
        happyPack: {
            id: 'jsx',
            loaders: [
                {
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            'es2015',
                            'stage-2',
                            'react'
                        ]
                    }
                }
            ],
            threads: 4
        },
        development: {
            filename: '[name].js',
            chunkFilename: '[name].chunk.js',
            commonFilename: '.js'
        },
        production: {
            filename: '[name]-[chunkhash].js',
            commonFilename: '-[chunkhash].js',
            chunkFilename: '[name]-[chunkhash].chunk.js',
            manifestFilename: 'rev-manifest.json'
        }
    },
    browserSync: {
        proxy: {
            target: 'localhost:3001',
            reqHeaders: function () {
                return {
                    host: 'localhost:3000'
                };
            }
        },
        notify: false,
        open: false
    },
    sass: {
        src: [
            assetDir + '/stylesheets/pages/**/*.scss',
            assetDir + '/stylesheets/**/_*.scss',
            '!**/*_scsslint_tmp*.scss'
        ],
        dest: publicDir + '/assets',
        settings: {
            includePaths: [
                assetDir + '/stylesheets',
                frontendDir,
                vendorDir + '/stylesheets'
            ],
            indentedSyntax: false // use cscc syntax and not sass
        },
        autoPrefixer: ['last 2 version']
    },
    images: {
        src: [
            assetDir + '/images/**/*',
            vendorDir + '/images/**/*'
        ],
        dest: publicDir + '/assets'
    },
    views: {
        src: [
            './app/views/**/*.slim',
            './app/helpers/**/*.rb',
            './app/controllers/**/*.rb',
            './app/serializers/**/*.rb',
            './config/locales/**/*.yml'
        ]
    },
    fonts: {
        src: [
            vendorDir + '/fonts/**/*',
            assetDir + '/fonts/**/*'
        ],
        dest: publicDir + '/assets/fonts'
    },
    data: {
        src: [
            vendorDir + '/data/**/*'
        ],
        dest: publicDir + '/assets/data'
    },
    production: {
        manifestFilename: 'rev-manifest.json',
        dest: publicDir + '/assets'
    },
    clean: [
        publicDir + '/javascripts',
        publicDir + '/stylesheets',
        publicDir + '/images',
        publicDir + '/fonts',
        publicDir + '/assets',
        publicDir + 'rev-manifest.json'
    ]

    // devServer: {
    //     contentBase: path.resolve('./public/assets'),
    //     publicPath: 'http://localhost:8080/assets/',
    //     hot: true
    // }
};
