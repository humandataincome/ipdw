import path from "path";
import pkg from 'webpack';
import {fileURLToPath} from 'url';
import {merge as webpackMerge} from "webpack-merge";
import nodeExternals from "webpack-node-externals";
import {CleanWebpackPlugin} from "clean-webpack-plugin";

const {ProvidePlugin} = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const commonsConfig = {
    context: __dirname,

    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
            cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, './dist')],
        })
    ],

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

    performance: {
        hints: false
    },

    optimization: {
        minimize: true
    }
}

export default (env, argv) => ([
    webpackMerge(commonsConfig, {
        target: 'web',

        experiments: {
            outputModule: true,
        },

        output: {
            path: __dirname + '/dist/web',
            filename: '[name].js',
            libraryTarget: "module",
            chunkFormat: "module"
        },

        resolve: {
            fallback: {
                crypto: 'crypto-browserify',
                stream: 'stream-browserify',
                os: 'os-browserify/browser',
                net: false,
                fs: false,
                path: false
            }
        },

        plugins: [
            new ProvidePlugin({
                Buffer: ['buffer', 'Buffer'] // Fix for sub-dependencies that use Buffer not from buffer
            }),
            new ProvidePlugin({process: 'process/browser.js'})
        ]
    }),

    webpackMerge(commonsConfig, {
        target: 'node',

        externals: [nodeExternals({importType: 'module'})],

        experiments: {
            outputModule: true,
        },

        output: {
            path: __dirname + '/dist/node',
            filename: '[name].js',
            libraryTarget: "module",
            chunkFormat: "module"
        },
    })
])

