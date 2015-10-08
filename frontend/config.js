var publicDir = './public';
var assetDir = './app/assets';
var vendorDir = './vendor/assets';
var frontendDir = './node_modules';

module.exports = {
    webpack: {
        context: './app/assets/javascripts',
        entries: {
            ie8: [ './modules/ie8.js' ],
            ie9: [ './modules/ie9.js' ],
            home: [ './pages/home.jsx' ],
            'users/show': [ './pages/users/show.jsx' ],
            'users/edit': [ './pages/users/edit.js' ],
            'users/login': [ './pages/users/login.js' ],
            'users/signup': [ './pages/users/signup.js' ],
            'users/password': [ './pages/users/password.js' ]
        },

        commons: [
            {
                name: 'common-user',
                files: ['users/show', 'users/edit', 'users/login', 'users/signup', 'users/password']
            },
            {
                name: 'commons',
                files: ['ie8', 'ie9', 'home', 'common-user']
            }
        ],
        output: {
            path: './public/assets/pages',
            publicPath: '/assets/pages'
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
            "window.jQuery": 'jquery',
            log: 'loglevel'
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
        notify: false,
        open: false
    },
    sass: {
        src: [ assetDir + '/stylesheets/**/*.scss', '!**/*_scsslint_tmp*.scss' ],
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
            frontendDir + '/font-awesome/fonts/**.*',
            // Font in materialize or mdi packages are not working
            //frontendDir + '/materialize-css/font/**/*',
            // Use instead the last downloaded font from Google
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
