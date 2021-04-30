const yenv = require('yenv');

const assetDir = './app/assets';
// const frontendDir = './node_modules';

const appEnv = yenv('./config/application.yml');

module.exports = {
    webpack: {
        context: './app/assets',
        entries: {
            default: ['./javascripts/pages/default.jsx'],
            user: ['./javascripts/pages/user.jsx'],
            admins: ['./javascripts/pages/admins.jsx'],
            'admins/login': ['./javascripts/pages/admins/login.jsx']
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
                    importLoaders: 2,
                    url: false
                }
            },
            sass: {
                options: {
                    includePaths: [
                        assetDir + '/stylesheets',
                        // frontendDir
                    ],
                    indentedSyntax: false // Use cscc syntax and not sass
                }
            },
            file: {
                exclude: /node_modules/,
                options: {
                    bypassOnDebug: false,
                    outputPath: 'images/',
                    name: '[name].[contenthash][ext]',
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
                    name: '[name].[contenthash][ext]'
                }
            }
        },
        alias: {
            react: 'node_modules/react',
            'react-dom': 'node_modules/react-dom',
            jquery: 'node_modules/jquery/dist/jquery.slim',
            lodash: 'node_modules/lodash'
        },
        plugins: {
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery',
            "window.$": 'jquery',
            "window.jQuery": 'jquery',
            React: 'react',
            ReactDOM: 'react-dom',
            PropTypes: 'prop-types',
            connect: ['react-redux', 'connect'],
            classNames: 'classnames',
            I18n: 'app/assets/javascripts/modules/i18n.js',
            Utils: 'app/assets/javascripts/modules/utils.js',
            Notification: 'app/assets/javascripts/components/layouts/notification.jsx'
        },
        // replacementPlugins: [
        //     // Keep only the specified packages in the package
        //     [
        //         /moment[/\\]locale$/,
        //         /en|fr/
        //     ]
        // ],
        // ignorePlugins: [
        //     // Exclude local packages
        //     // Work only for local sources
        //     {
        //         resourceRegExp: /react-beautiful-dnd/
        //     }
        // ],
        // externals: {
        //     // Exclude external packages included in node_modules
        //     'react-beautiful-dnd': {}
        // },
        fonts: [
            {
                from: './fonts/**/*',
                to: 'fonts/'
            }
        ],
        translations: 'javascripts/translations',
        images: [
            {
                from: './images/logos/*',
                to: 'logos/'
            },
            {
                from: './images/home/*',
                to: 'home/'
            }
        ],
        datas: [
            {
                from: './data/pghero/**/*',
                to: 'pghero/'
            }
        ],
        serviceWorker: {
            dest: '../service-worker.js',
            exclude: [/admin/, /about/, /privacy/, /terms/, /comment\./, /comment-box\./, /compare\./, /history\./, /tracker\./, /edit\./, /edition\./, /editor\./, /sort\./, /persistence\./, /share\./, /login\./, /signup\./, /password\./, /user-confirmation\./, /preference\./, /\.ttf$/, /\.eot$/, /\.woff$/, /\.map$/, /apple-touch/, /LICENSE/, /statics-/, /pghero/],
            additionalFiles: [
                {url: 'offline.html', revision: '1'},
                {url: 'favicon.ico', revision: '1'}
            ],
            runtimeCaching: [
                {
                    // Match all assets
                    urlPattern: new RegExp(`^${appEnv.WEBSITE_FULL_ASSET}/assets/`),
                    handler: 'CacheFirst',
                    // handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'assets',
                        cacheableResponse: {
                            statuses: [0, 200]
                        },
                        expiration: {
                            maxEntries: 80
                        }
                    }
                },
                {
                    // Match any request that ends with .png, .jpg, .jpeg or .svg
                    // urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                    urlPattern: /uploads\//,
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
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api',
                        expiration: {
                            maxEntries: 50
                        }
                    }
                },
                {
                    urlPattern: ({request}) => request.mode === 'navigate',
                    handler: 'NetworkOnly',
                    options: {
                        precacheFallback: {
                            fallbackURL: '/offline.html',
                        }
                    }
                }
            ],
            // offlineFile: '/offline.html',
            // offlineExclude: [/\/api\//],
            // transformURL: {
            //     [appEnv.WEBSITE_FULL_ASSET]: appEnv.WEBSITE_FULL_ADDRESS,
            // }
        },
        development: {
            assetPath: `${appEnv.WEBSITE_FULL_ASSET}/assets/`,
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
            assetPath: `http://localhost:${appEnv.TEST_PORT || 3000}/assets/`,
            filename: '[name]',
            chunkFilename: '[name]'
        },
        production: {
            assetPath: `${appEnv.WEBSITE_FULL_ASSET}/assets/`,
            filename: '[name].[contenthash]',
            filenameImage: '[name]',
            filenameFont: '[name]',
            chunkFilename: '[name].[contenthash].[id]',
            manifestFilename: 'manifest.json'
        }
    }
};
