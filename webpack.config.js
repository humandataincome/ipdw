const path = require('path');

module.exports = (env, argv) => {
  return {
    context: __dirname,
    entry: {
      index: './src/index.ts',
    },

    resolve: {
      extensions: ['.ts', '.js', '.json'],
      fallback: {
        crypto: require.resolve('crypto-browserify')
      }
    },

    output: {
      path: __dirname + '/build',
      filename: '[name].js',
      clean: true,
    },

    module: {
      rules: [
        { test: /\.ts?$/,  use: 'ts-loader',  exclude: /node_modules/ },
      ],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, ''),
      },
      compress: false,
      port: 9000,
    },
  }
}
