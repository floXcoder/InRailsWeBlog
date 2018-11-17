const publicDir = './public';
const assetDir = './app/assets';
const frontendDir = './node_modules';

module.exports = {
    webpack: {
        context: './app/assets',
        entries: {
            home: ['./javascripts/pages/home/home.jsx'],
            user: ['./javascripts/pages/home/user.jsx'],
            'errors/error': ['./javascripts/pages/errors/error.jsx'],
            // 'users/show': ['./javascripts/pages/users/show.jsx'],
            // 'users/edit': ['./javascripts/pages/users/edit.jsx'],
            // 'users/login': ['./javascripts/pages/users/login.jsx'],
            // 'users/signup': ['./javascripts/pages/users/signup.jsx'],
            // 'users/password': ['./javascripts/pages/users/password.jsx'],
            // 'articles/show': ['./javascripts/pages/articles/show.jsx'],
            // 'articles/edit': ['./javascripts/pages/articles/edit.jsx'],
            // 'tags/show': ['./javascripts/pages/tags/show.jsx'],
            // 'admin/dashboard': ['./javascripts/pages/admin/dashboard.jsx'],
            // 'admin/users/index': ['./javascripts/pages/admin/managers/index.jsx'],
            // 'admin/users/show': ['./javascripts/pages/admin/managers/show.jsx'],
            // 'admin/errors': ['./javascripts/pages/admin/managers/errors.jsx']
        },

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
        rules: {
            javascript: {
                options: {
                    babelrc: true,
                    cacheDirectory: true
                }
            },
            stylesheet: {
                options: {
                    includePaths: [
                        assetDir + '/stylesheets',
                        frontendDir
                    ],
                    indentedSyntax: false // use cscc syntax and not sass
                }
            },
            file: {
                options: {
                    bypassOnDebug: false,
                    outputPath: 'images/',
                    name: '[name].[hash].[ext]',
                    publicPath: 'assets/',
                    mozjpeg: {
                        progressive: true,
                        quality: 85
                    },
                    pngquant: {
                        quality: '65-90',
                        speed: 4
                    }
                }
            }
        },
        alias: {
            react: 'node_modules/react',
            jquery: 'node_modules/jquery/dist/jquery',
            lodash: 'node_modules/lodash'
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
            classNames: 'classnames'
        },
        ignorePlugins: [
            /^codemirror$/
        ],
        translations: 'javascripts/translations',
        images: [
            {
                from: 'images/logos',
                to: 'logos'
            }
        ],
        development: {
            assetPath: 'http://localhost:8080/assets/',
            filename: '[name]',
            chunkFilename: '[name]',
            watchPath: [
                'app/controller/**/*',
                'app/queries/**/*',
                'app/serializers/**/*',
                'app/views/**/*'
            ]
        },
        test: {
            assetPath: 'http://localhost:3020/assets/',
            filename: '[name]',
            chunkFilename: '[name]'
        },
        production: {
            assetPath: 'https://assets.inrailsweblog.com/assets/',
            filename: '[name].[hash]',
            chunkFilename: '[name].[hash].[id]',
            manifestFilename: 'rev-manifest.json'
        },
        clean: {
            pathsToClean: [
                '../assets/*'
            ]
        }
    },
    production: {
        manifestFilename: 'rev-manifest.json',
        dest: publicDir + '/assets'
    },
};
