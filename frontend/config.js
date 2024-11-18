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
                    loadPaths: [
                        assetDir + '/stylesheets',
                        // frontendDir
                    ],
                    // indentedSyntax: false // Use cscc syntax and not sass
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
            exclude: [
                /about/, /privacy/, /terms/, /processing/, /validation/, /exporter/, /admin/, /performance/, /new\./, /new-\./, /edit\./, /edit-\./, /edition\./, /editor\./, /login\./, /signup\./, /password\./, /user-confirmation\./, /tinymce\./, /\.ttf$/, /\.eot$/, /\.woff$/, /\.geojson$/, /\.map$/, /komoot/, /LICENSE/, /pghero/, /metrics/, /webmanifest/, /comment\./, /comment-box\./, /compare\./, /history\./, /tracker\./, /sort\./, /persistence\./, /share\./
            ],
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
                    urlPattern: new RegExp(`^${appEnv.WEBSITE_FULL_ASSET}(\/vite)?\/assets\/`),
                    // handler: 'CacheFirst',
                    // Workbox will also hit the network in parallel and check if there are updates to that resource
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: `assets-v${appEnv.PWA_ASSETS_VERSION || 0}`,
                        cacheableResponse: {
                            statuses: [0, 200]
                        },
                        expiration: {
                            maxEntries: 120
                            // maxAgeSeconds: 24 * 60 * 60,
                        }
                    }
                },
                {
                    // Match any API requests
                    urlPattern: new RegExp(`^${appEnv.WEBSITE_FULL_ADDRESS}\/(?!.*(orders|baskets|uploader|exporter|processing|validation|manifest).*).*/`),
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: `api-v${appEnv.PWA_API_VERSION || 0}`,
                        networkTimeoutSeconds: 3,
                        expiration: {
                            maxEntries: 100
                        }
                    }
                },
                {
                    // Match any request that ends with .png, .jpg, .jpeg or .svg
                    // urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                    urlPattern: new RegExp(`^${appEnv.WEBSITE_FULL_ASSET}\/uploads\/`),
                    handler: 'CacheFirst',
                    options: {
                        cacheName: `images-v${appEnv.PWA_ASSETS_VERSION || 0}`,
                        cacheableResponse: {
                            statuses: [0, 200]
                        },
                        expiration: {
                            maxEntries: 100
                        }
                    }
                },
                {
                    // Match all website content (HTML, ...)
                    urlPattern: new RegExp(`^${appEnv.WEBSITE_FULL_ADDRESS}\/(?!.*(api|admins|manifest).*).*/`),
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: `others-v${appEnv.PWA_OTHERS_VERSION || 0}`,
                        cacheableResponse: {
                            statuses: [0, 200]
                            // Cache only HTML pages:
                            // headers: {
                            //     'Content-Type': 'text/html; charset=utf-8'
                            // }
                        },
                        expiration: {
                            maxEntries: 200
                        }
                    }
                },
                {
                    // Match all other external content
                    urlPattern: /^(?!.*(admins).*).*$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'external',
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
            assetPath: '/assets/',
            filename: '[name].[contenthash]',
            filenameImage: '[name]',
            filenameFont: '[name]',
            filenameData: '[name]',
            chunkFilename: '[name].[contenthash].[id]',
            manifestFilename: 'manifest.json'
        }
    }
};
