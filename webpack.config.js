const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {ProvidePlugin} = require('webpack');

module.exports = (env, argv) => {
    console.log(argv)
    return {
        context: __dirname,
        entry: {
            index: './src/index.ts',

            ...(argv.mode === 'development' && argv.target.includes('node') ? {
                test: './test/node/index.ts'
            } : {}),

            ...(argv.mode === 'development' && argv.target.includes('web') ? {
                test: './test/web/index.ts'
            } : {})
        },

        resolve: {
            extensions: ['.ts', '.js', '.json'],
            fallback: {
                crypto: require.resolve(argv.target.includes('web') ? 'crypto-browserify' : 'crypto'),
                stream: require.resolve(argv.target.includes('web') ? 'stream-browserify' : 'stream')
            }
        },

        output: {
            path: __dirname + '/build',
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
        },

        plugins: argv.target.includes('web') ? [
            new ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
            ...(argv.mode === 'development' ? [
                new HtmlWebpackPlugin({
                    template: './test/web/index.html',
                    filename: 'test.html',
                    chunks: ['test']
                })] : [])
        ] : []
    }
}
