import {defineConfig} from '@rsbuild/core';
import {pluginReact} from '@rsbuild/plugin-react';
import {pluginSass} from '@rsbuild/plugin-sass';
import {GenerateSW} from '@aaroon/workbox-rspack-plugin';

import yenv from 'yenv';

let appEnv;
if (process.env.CI_SERVER) {
    appEnv = process.env;
} else {
    appEnv = yenv('./config/application.yml', {env: process.env.NODE_ENV || 'development'});
}

let RsdoctorPlugin;
if (process.env.RSDOCTOR) {
    const {RsdoctorRspackPlugin} = require('@rsdoctor/rspack-plugin');
    RsdoctorPlugin = RsdoctorRspackPlugin;
}

export default defineConfig({
    root: './',
    publicDir: './public/assets',
    output: {
        // filenameHash: true, // true for production only
        distPath: {
            root: './public/assets',
            js: './javascripts',
            css: './stylesheets',
            image: './images',
            svg: './images',
            media: './images',
            font: './fonts',
            assets: './assets'
        },
        assetPrefix: '/assets/',
        copy: [
            {
                from: './app/assets/images/logos/*',
                to: 'images/logos/[name][ext]',
                toType: 'template'
            },
            {
                from: './app/assets/data/pghero/**/*',
                to: 'pghero/[name][ext]',
                toType: 'template'
            }
        ],
        manifest: true
    },
    source: {
        entry: {
            default: './app/assets/entrypoints/default.jsx',
            'pages/default': './app/assets/entrypoints/stylesheets/default.scss',
            user: './app/assets/entrypoints/user.jsx',
            'pages/user': './app/assets/entrypoints/stylesheets/user.scss',
            admins: './app/assets/entrypoints/admins.jsx',
            'admins/login': './app/assets/entrypoints/admins/login.jsx',
            'pages/admin': './app/assets/entrypoints/stylesheets/admin.scss'
        }
    },
    plugins: [
        // Rsbuild use Lightning CSS by default (autoprefixer is automatically included and it uses .browserslistrc file to generate compliant CSS)
        pluginSass({
            sassLoaderOptions: {
                api: 'modern-compiler',
                sourceMap: true,
                sassOptions: {
                    loadPaths: [
                        './app/assets/stylesheets'
                        // frontendDir
                    ],
                    // quietDeps: true,
                    // silenceDeprecations: ['import'],
                }
            }
        }),
        pluginReact()
    ],
    resolve: {
        extensions: ['.jsx', '.js'],
        alias: {
            '@': './app/assets',
            '@js': './app/assets/javascripts',
            '@css': './app/assets/stylesheets'
        }
    },
    tools: {
        htmlPlugin: false,
        rspack(config, {appendPlugins}) {
            // Only register the plugin when RSDOCTOR is true, as the plugin will increase the build time.
            if (process.env.RSDOCTOR) {
                appendPlugins(
                    new RsdoctorPlugin({
                        port: appEnv.ASSETS_ANALYZER_PORT,
                        supports: {
                            generateTileGraph: true
                        }
                    })
                );
            }

            if (process.env.NODE_ENV === 'production') {
                appendPlugins(
                    new GenerateSW({
                        swDest: '../service-worker.js',
                        inlineWorkboxRuntime: true,
                        additionalManifestEntries:  [
                            {
                                url: 'offline.html',
                                revision: null
                            },
                            {
                                url: 'favicon.ico',
                                revision: null
                            }
                        ],
                        clientsClaim: true,
                        skipWaiting: true,
                        offlineGoogleAnalytics: false,
                        maximumFileSizeToCacheInBytes: 4_000_000,
                        exclude: [
                            /about/, /privacy/, /terms/, /processing/, /validation/, /exporter/, /admins/, /performance/, /new\./, /new-\./, /edit\./, /edit-\./, /edition\./, /editor\./, /login\./, /signup\./, /password\./, /user-confirmation\./, /tinymce\./, /\.ttf$/, /\.eot$/, /\.woff$/, /\.geojson$/, /\.map$/, /komoot/, /LICENSE/, /pghero/, /metrics/, /webmanifest/, /comment\./, /comment-box\./, /compare\./, /history\./, /tracker\./, /sort\./, /persistence\./, /share\./
                        ],
                        runtimeCaching: [
                            {
                                // Match all assets
                                urlPattern: new RegExp(`^https://(${appEnv.ASSETS_HOST}|${appEnv.WEBSITE_HOST})/assets/`),
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
                                urlPattern: new RegExp(`^${appEnv.WEBSITE_URL}/(?!.*(assets|uploads|orders|baskets|uploader|exporter|processing|validation|manifest|admins).*).*/`),
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
                                urlPattern: new RegExp(`^https://(${appEnv.ASSETS_HOST}|${appEnv.WEBSITE_HOST})/uploads/`),
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
                                urlPattern: new RegExp(`^${appEnv.WEBSITE_URL}/(?!.*(api|admins|manifest).*).*/`),
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
                        // navigateFallback: '/offline.html',
                        // navigateFallbackDenylist: [/\/api\//]
                    })
                );
            }

            return config;
        }
    },
    // performance: {
    //     chunkSplit: {
    //         strategy: 'all-in-one'
    //     }
    // },
    dev: {
        port: `${appEnv.ASSETS_HOST.split(':')[1]}`,
        hmr: true,
        liveReload: false,
        // writeToDisk: true,
        assetPrefix: `http://${appEnv.ASSETS_HOST}`,
        client: {
            protocol: 'ws',
            host: 'localhost',
            port: `${appEnv.ASSETS_HOST.split(':')[1]}`
        },
        overlay: true,
        // lazyCompilation: {
        //     imports: true
        // }
    },
    server: {
        publicDir: {
            // watch: true,
            // name: path.join(__dirname, '../some-public'),
            copyOnBuild: false
        }
    }
});