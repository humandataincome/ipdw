const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {ProvidePlugin} = require('webpack');
const { merge: webpackMerge } = require('webpack-merge');

const commonsConfig = {
    context: __dirname,
    entry: {
        index: './src/index.ts',
    },

    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },

    module: {
        rules: [
            {test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/},
            {test: /\.html$/, use: 'html-loader'}
        ],
    },

    devServer: {
        open: ['/test.html'],
        watchFiles: ['src/*', 'test/*'],
        port: 9000,
        static: {
            directory: path.join(__dirname, 'build'),
        },
    }
}

module.exports = (env, argv) => ([
    webpackMerge(commonsConfig, {
        target: 'web',

        entry: argv.mode === 'development'
            ? { test: './test/web/index.ts' }
            : { },

        output: {
            path: __dirname + '/build/web',
            filename: '[name].js',
            clean: true,
        },

        resolve: {
            fallback: {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify')
            }
        },

        plugins: [
            new ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
            ...( argv.mode !== 'development'
                    ? [ ]
                    : [
                        new HtmlWebpackPlugin({
                            template: './test/web/index.html',
                            filename: 'test.html',
                            chunks: ['test']
                        })
                    ]
            )
        ]
    }),

    webpackMerge(commonsConfig, {
        target: 'node',

        entry: argv.mode === 'development'
            ? { test: './test/node/index.ts' }
            : { },

        output: {
            path: __dirname + '/build/node',
            filename: '[name].js',
            clean: true
        },

        resolve: {
            fallback: {
                crypto: require.resolve('crypto'),
                stream: require.resolve('stream')
            }
        },

        plugins: []
    })
])
