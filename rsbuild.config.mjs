import {defineConfig} from '@rsbuild/core';
import {pluginReact} from '@rsbuild/plugin-react';
import {pluginSass} from '@rsbuild/plugin-sass';

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
            development: './app/assets/entrypoints/development.js',
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
        htmlPlugin: false
    },
    // performance: {
    //     chunkSplit: {
    //         strategy: 'all-in-one'
    //     }
    // },
    dev: {
        port: 8080,
        hmr: true,
        liveReload: false,
        // writeToDisk: true,
        assetPrefix: 'http://localhost:8080/',
        client: {
            protocol: 'ws',
            host: 'localhost',
            port: 8080
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