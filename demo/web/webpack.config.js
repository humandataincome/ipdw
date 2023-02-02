import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import pkg from 'webpack';
import {fileURLToPath} from 'url';

const {ProvidePlugin} = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default (env, argv) => ({
        target: 'web',
        context: __dirname,

        entry: {
            index: './src/index.ts',
        },

        module: {
            rules: [
                {test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/},
                {test: /\.html$/, use: 'html-loader'},
            ],
        },

        output: {
            path: __dirname + '/dist',
            filename: '[name].js',
            clean: true
        },

        resolve: {
            extensions: ['.ts', '.js', '.json'],
        },

        devServer: {
            open: ['/index.html'],
            watchFiles: ['src/*'],
            static: {
                directory: path.join(__dirname, 'dist'),
            },
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: 'index.html',
            })
        ]
    }
)

