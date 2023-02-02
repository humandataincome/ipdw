import path from "path";
import pkg from 'webpack';
import {fileURLToPath} from 'url';
import {merge as webpackMerge} from "webpack-merge";
import nodeExternals from "webpack-node-externals";

const {ProvidePlugin} = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        ],
    },
}

export default (env, argv) => ([
    webpackMerge(commonsConfig, {
        target: 'web',

        output: {
            path: __dirname + '/dist',
            filename: '[name].min.js',
        },

        resolve: {
            fallback: {
                crypto: 'crypto-browserify',
                stream: 'stream-browserify'
            }
        },

        plugins: [
            new ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            })
        ]
    }),

    webpackMerge(commonsConfig, {
        target: 'node',
        externals: [nodeExternals()],

        experiments: {
            outputModule: true,
        },

        output: {
            path: __dirname + '/dist',
            filename: '[name].js',
            chunkFormat: "array-push",
        },
    })
])

