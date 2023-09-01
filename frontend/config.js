const yenv = require('yenv');

const assetDir = './app/assets';
// const frontendDir = './node_modules';

let appEnv;
if (process.env.CI_SERVER) {
    appEnv = process.env;
} else {
    appEnv = yenv('./config/application.yml');
}

module.exports = {
    webpack: {
        context: './app/assets',
        entries: {
            polyfills: ['./javascripts/polyfills.js'],
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
            jquery: 'node_modules/jquery/dist/jquery.slim'
        },
        plugins: {
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
            React: 'react',
            ReactCreateRoot: ['react-dom/client', 'createRoot'],
            PropTypes: 'prop-types',
            connect: ['react-redux', 'connect'],
            classNames: 'classnames',
            I18n: ['app/assets/javascripts/modules/translations.js', 'default'],
            Notification: ['app/assets/javascripts/components/layouts/notification.jsx', 'message'],
            Utils: 'app/assets/javascripts/modules/utils.js'
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
                {
                    url: 'offline.html',
                    revision: null
                },
                {
                    url: 'favicon.ico',
                    revision: null
                }
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
                    urlPattern: new RegExp(`^${appEnv.WEBSITE_FULL_ASSET}/uploads/`),
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'images',
                        cacheableResponse: {
                            statuses: [0, 200]
                        },
                        expiration: {
                            maxEntries: 50
                        }
                    }
                },
                {
                    // Match any API requests
                    urlPattern: /\/api\/v1\/(?!orders|baskets|uploader|exporter)/,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api',
                        networkTimeoutSeconds: 3,
                        expiration: {
                            maxEntries: 50
                        }
                    }
                },
                {
                    // Match all other content (HTML, other map providers, ...)
                    urlPattern: /^((?!.*admins.*).)*$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'others',
                        cacheableResponse: {
                            statuses: [0, 200]
                            // Cache only HTML pages:
                            // headers: {
                            //     'Content-Type': 'text/html; charset=utf-8'
                            // }
                        },
                        expiration: {
                            maxEntries: 500
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
            filenameData: '[name]',
            chunkFilename: '[name].[contenthash].[id]',
            manifestFilename: 'manifest.json'
        }
    }
};
