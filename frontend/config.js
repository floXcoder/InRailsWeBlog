var publicDir = './public';
var assetDir = './app/assets';
var vendorDir = './vendor/assets';
var frontendDir = './vendor/components';

module.exports = {
    bower: {
        dest: frontendDir
    },
    webpack: {
        context: './app/assets/javascripts',
        entries: {
            home: [ './home/home.js' ],
            ie8: [ './modules/ie8.js' ],
            ie9: [ './modules/ie9.js' ]
        },

        commons: [
            {
                name: 'common-user',
                files: []
            },
            {
                name: 'commons',
                files: ['ie8', 'ie9', 'home', 'common-user']
            }
        ],
        output: {
            path: './public/assets',
            publicPath: '/assets/'
        },
        modules: {
            includes: [
                'vendor/assets/javascripts',
                'node_modules',
                'vendor/components'
            ]
        },
        plugins: {
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": 'jquery'
            //_: 'lodash'
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
        proxy: 'http://localhost:3001',
        open: false
    },
    sass: {
        src: [assetDir + '/stylesheets/**/*.scss', '!**/*_scsslint_tmp*.scss'],
        dest: publicDir + '/assets',
        settings: {
            includePaths: [
                frontendDir,
                frontendDir + '/fontawesome/scss',
                vendorDir + '/stylesheets'
            ],
            indentedSyntax: false // use cscc syntax and not sass
        },
        autoPrefixer: ['last 2 version']
    },
    images: {
        src: [
            vendorDir + '/images/**/*',
            assetDir + '/images/**/*'
        ],
        dest: publicDir + '/assets'
    },
    views: {
        src: [
            './app/views/**/*.slim',
            './app/presenters/**/*.rb',
            './app/helpers/**/*.rb',
            './app/inputs/**/*.rb',
            './app/presenters/**/*.rb',
            './config/locales/**/*.yml'
        ]
    },
    fonts: {
        src: [
            frontendDir + '/fontawesome/fonts/**.*',
            vendorDir + '/fonts/**/*',
            assetDir + '/fonts/**/*'
        ],
        dest: publicDir + '/assets'
    },
    html: {
        src: [
            //vendorDir + '/**/*'
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
