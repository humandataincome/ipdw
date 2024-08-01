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

        entry: {
            index: './src/index.ts',
        },

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
                fs: false,
                assert: 'assert/',
                vm: 'vm-browserify',
                http: 'stream-http',
                https: 'https-browserify',
                zlib: 'browserify-zlib',
                url: 'url/'
            },
            alias: {
                '@libp2p/upnp-nat': false,
                '@libp2p/tcp': false,
                '@libp2p/mdns': false,
                'datastore-fs': false
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

        entry: {
            index: './src/index.ts',
        },

        externals: [nodeExternals({importType: 'module'})],

        experiments: {
            outputModule: true,
        },

        resolve: {
            alias: {
                '@libp2p/webtransport': false,
                'datastore-idb': false
            }
        },

        output: {
            path: __dirname + '/dist/node',
            filename: '[name].js',
            libraryTarget: "module",
            chunkFormat: "module"
        },
    })
])

