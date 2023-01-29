import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import pkg from 'webpack';
import {merge as webpackMerge} from "webpack-merge";
import {fileURLToPath} from 'url';

const {ProvidePlugin} = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commonsConfig = {
    target: ['web', 'node'],
    devtool: 'source-map',
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
}

export default (env, argv) => ([
    webpackMerge(commonsConfig, {
        target: 'web',

        entry: argv.mode === 'development'
            ? { test: './test/web/index.ts' }
            : { },

        output: {
            path: __dirname + '/dist/web',
            filename: '[name].js',
        },

        resolve: {
            fallback: {
                crypto: 'crypto-browserify',
                stream: 'stream-browserify'
            }
        },

        devServer: {
            open: ['/test.html'],
            watchFiles: ['src/*', 'test/*'],
            static: {
                directory: path.join(__dirname, 'build'),
            },
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
            path: __dirname + '/dist/node',
            filename: '[name].js',
        },

        resolve: {
            fallback: {
                crypto: false,
                stream: false
            }
        },
    })
])
