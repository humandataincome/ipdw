import path from "path";
import pkg from 'webpack';
import {fileURLToPath} from 'url';

const {ProvidePlugin} = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default (env, argv) => ({
        mode: "production",
        context: __dirname,

        entry: {
            index: './src/index.ts',
        },

        module: {
            rules: [
                {test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/},
                {test: /\.m?js/, resolve: { fullySpecified: false }}
            ],
        },

        output: {
            path: __dirname + '/dist',
            filename: '[name].min.js',
            clean: true,
            libraryTarget: "umd",
        },

        resolve: {
            extensions: ['.ts', '.js', '.json'],
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
    }
)

