var publicDir = './public';
var assetDir = './app/assets';
var vendorDir = './vendor/assets';
var frontendDir = './node_modules';

module.exports = {
    webpack: {
        context: './app/assets/javascripts',
        entries: {
            ie8: ['./modules/ie8.js'],
            ie9: ['./modules/ie9.js'],
            home: ['./pages/home/home.jsx'],
            'admin/dashboard': ['./pages/admin/dashboard.jsx'],
            'admin/users/index': ['./pages/admin/users/index.jsx'],
            'admin/users/show': ['./pages/admin/users/show.jsx'],
            'admin/errors': ['./pages/admin/errors.jsx'],
            'users/show': ['./pages/users/show.jsx'],
            'users/edit': ['./pages/users/edit.js'],
            'users/login': ['./pages/users/login.js'],
            'users/signup': ['./pages/users/signup.js'],
            'users/password': ['./pages/users/password.js'],
            'articles/show': ['./pages/articles/show.jsx'],
            'articles/edit': ['./pages/articles/edit.jsx'],
            'tags/show': ['./pages/tags/show.jsx']
        },

        commons: [
            {
                name: 'commons',
                files: [
                    'home',
                    'users/show', 'users/edit', 'users/login', 'users/signup', 'users/password', 'users/show',
                    'articles/show', 'articles/edit',
                    'tags/show'
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
                'vendor/assets/javascripts',
                'node_modules'
            ],
            noParse: [
                /highlight\.js[\/\\]lib[\/\\]languages[\/\\]autoit.js/
            ]
        },
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    babelrc: true,
                    cacheDirectory: true
                },
                happy: {id: 'jsx'}
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /masonry|imagesloaded|fizzy\-ui\-utils|desandro\-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
                loader: 'imports?define=>false&this=>window'
            }
        ],
        plugins: {
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
            _: 'lodash',
            log: 'loglevel'
        },
        externals: {
            jQuery: 'jquery'
        },
        development: {
            filename: '[name].js',
            commonFilename: '.js'
        },
        production: {
            filename: '[name]-[chunkhash].js',
            commonFilename: '-[chunkhash].js',
            manifestFilename: 'rev-manifest.json'
        }
    },
    browserSync: {
        proxy: {target: 'http://localhost:3001'},
        notify: false,
        open: false
    },
    sass: {
        src: [
            assetDir + '/stylesheets/application.scss',
            assetDir + '/stylesheets/pages/**/*.scss',
            assetDir + '/stylesheets/**/_*.scss',
            '!**/*_scsslint_tmp*.scss'
        ],
        dest: publicDir + '/assets',
        settings: {
            includePaths: [
                frontendDir,
                vendorDir + '/stylesheets'
            ],
            indentedSyntax: false // use scss syntax and not sass
        },
        autoPrefixer: ['last 2 version']
    },
    images: {
        src: [
            assetDir + '/images/**/*'
        ],
        dest: publicDir + '/assets'
    },
    views: {
        src: [
            './app/views/**/*.slim',
            './app/helpers/**/*.rb',
            './app/inputs/**/*.rb',
            './app/controllers/**/*.rb',
            './app/serializers/**/*.rb',
            './config/locales/**/*.yml'
        ]
    },
    fonts: {
        src: [
            // Font in materialize or mdi packages are not working
            // Use instead the last downloaded font from Google
            //frontendDir + '/materialize-css/font/**/*',
            vendorDir + '/fonts/**/*',
            assetDir + '/fonts/**/*'
        ],
        dest: publicDir + '/assets'
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
};
