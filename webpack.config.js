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
        ],
    },
}

export default (env, argv) => ([
    webpackMerge(commonsConfig, {
        target: 'web',

        entry: argv.mode === 'development'
            ? {test: './test/web/index.ts'}
            : {},

        output: {
            path: __dirname + '/build/web',
            filename: '[name].js',
            clean: true,
        },

        resolve: {
            alias: {
                crypto: 'crypto-browserify',
                stream: 'stream-browserify'
            }
        },

        plugins: [
            new ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
            ...(argv.mode !== 'development'
                    ? []
                    : [
                        new HtmlWebpackPlugin({
                            template: './test/web/index.html',
                            filename: 'test.html',
                            chunks: ['test']
                        })
                    ]
            )
        ],

        devServer: {
            open: ['/test.html'],
            watchFiles: ['src/*', 'test/*'],
            static: {
                directory: path.join(__dirname, 'build'),
            },
        }
    }),

    webpackMerge(commonsConfig, {
        target: 'node',

        entry: argv.mode === 'development'
            ? {test: './test/node/index.ts'}
            : {},

        output: {
            path: __dirname + '/build/node',
            filename: '[name].js',
            clean: true
        },

        module: {
            rules: [
                {test: /\.node$/, use: 'node-loader'}
            ],
        },

        plugins: []
    })
])
