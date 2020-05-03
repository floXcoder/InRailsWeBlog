const assetDir = './app/assets';
const frontendDir = './node_modules';

module.exports = {
    webpack: {
        context: './app/assets',
        entries: {
            home: ['./javascripts/pages/home/home.jsx'],
            user: ['./javascripts/pages/home/user.jsx'],
            'admins/login': ['./javascripts/pages/admins/login.jsx'],
            'admins/dashboard': ['./javascripts/pages/admins/dashboard.jsx'],
            'admins/users': ['./javascripts/pages/admins/users.jsx'],
            'admins/comments': ['./javascripts/pages/admins/comments.jsx'],
            'admins/topics': ['./javascripts/pages/admins/topics.jsx'],
            'admins/tags': ['./javascripts/pages/admins/tags.jsx'],
            'admins/articles': ['./javascripts/pages/admins/articles.jsx'],
            'admins/blogs': ['./javascripts/pages/admins/blogs.jsx'],
            'admins/seo': ['./javascripts/pages/admins/seo.jsx'],
            'admins/logs': ['./javascripts/pages/admins/logs.jsx'],
            'admins/cache': ['./javascripts/pages/admins/cache.jsx']
        },
        output: {
            path: './public/assets',
            publicPath: '/assets/'
        },
        modules: {
            includes: [
                'node_modules'
            ],
            // noParse: // Must not contain any import mechanism
        },
        rules: {
            javascript: {
                include: './app/assets/javascripts',
                options: {
                    babelrc: true,
                    cacheDirectory: true
                }
            },
            stylesheet: {
                exclude: /node_modules/,
                options: {
                    includePaths: [
                        assetDir + '/stylesheets',
                        frontendDir
                    ],
                    indentedSyntax: false // Use cscc syntax and not sass
                }
            },
            file: {
                exclude: /node_modules/,
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
                        quality: [0.65, 0.90],
                        speed: 4
                    }
                }
            },
            font: {
                exclude: /node_modules/,
                options: {
                    outputPath: 'fonts/',
                    name: '[name].[hash].[ext]'
                }
            }
        },
        datas: [
            {
                from: './data/pghero/**/*',
                to: 'pghero/'
            }
        ],
        alias: {
            react: 'node_modules/react',
            'react-dom': 'node_modules/react-dom',
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
            classNames: 'classnames',
            Utils: 'app/assets/javascripts/modules/utils.js',
            Notification: 'app/assets/javascripts/components/layouts/notification.jsx'
        },
        ignorePlugins: [
            /^codemirror$/
        ],
        happyPack: {
            loaders: ['babel-loader'],
            threads: 4
        },
        fonts: 'fonts',
        translations: 'javascripts/translations',
        images: [
            {
                from: 'images/logos',
                to: 'logos'
            }
        ],
        serviceWorker: {
            dest: '../serviceWorker.js',
            exclude: [/admin/, /about/, /policy/, /terms/, /comment\./, /compare\./, /history\./, /tracker\./, /edit\./, /edition\./, /editor\./, /sort\./, /persistence\./, /share\./, /login\./, /signup\./, /password\./, /preference\./, /\.ttf/, /\.eot/, /\.woff/],
            additionalFiles: [
                {url: 'offline.html', revision: '1'},
                {url: 'favicon.ico', revision: '1'}
            ],
            runtimeCaching: [
                {
                    // Match any request that ends with .png, .jpg, .jpeg or .svg
                    // urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                    urlPattern: /uploads/,
                    // Apply a cache-first strategy
                    handler: 'CacheFirst',
                    options: {
                        // Use a custom cache name
                        cacheName: 'images',
                        // Only cache 30 uploads
                        expiration: {
                            maxEntries: 30
                        }
                    }
                },
                {
                    // Match any API requests
                    urlPattern: /\.json/,
                    // Fetch both in cache and through network
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'api',
                        expiration: {
                            maxEntries: 50
                        }
                    }
                }
            ],
            offlineFile: '/offline.html',
            offlineExclude: [/\/api\//],
            transformURL: {
                'assets.ginkonote.com': 'www.ginkonote.com'
            }
        },
        development: {
            assetPath: 'http://localhost:8080/assets/',
            filename: '[name]',
            chunkFilename: '[name]',
            watchPath: [
                'app/controllers/**/*',
                'app/queries/**/*',
                'app/policies/**/*',
                'app/serializers/**/*',
                'app/views/**/*'
            ]
        },
        test: {
            assetPath: 'http://localhost:PORT/assets/',
            filename: '[name]',
            chunkFilename: '[name]'
        },
        production: {
            assetPath: 'https://assets.ginkonote.com/assets/',
            filename: '[name].[hash]',
            filenameImage: '[name]',
            chunkFilename: '[name].[hash].[id]',
            manifestFilename: 'manifest.json'
        }
    }
};
