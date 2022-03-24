const webpack = require('webpack')
const path = require('path')
const PACKAGE = require('./package.json')

// WebPack Plugins.
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const isProduction =
  process.argv[process.argv.indexOf('--mode') + 1] === 'production'

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /.(js)$/,
        exclude: [/node_modules/],
        use: ['babel-loader'],
      },
      {
        test: /.svg$/,
        use: ['@svgr/webpack', 'file-loader'],
      },
      {
        test: /.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js'],
    alias: {
      '@netflix-clone/images': path.resolve(
        __dirname,
        'src',
        'static',
        'assets',
        'images'
      ),
      '@netflix-clone/components': path.resolve(__dirname, 'src', 'components'),
    },
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    publicPath: !isProduction ? '/netflix-clone-web/react' : '',
    filename: 'netflix-clone.js',
    chunkFilename: '[name].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.EnvironmentPlugin({
      VERSION: PACKAGE.version,
    }),

    // Take Reference of HTML File.
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'src/static/index.html'),
      APP_ROOT_ID: 'netflix-clone',
      APP_VERSION: PACKAGE.version,
    }),

    // Copy all Assets, Icons to public Folder.
    new CopyPlugin({
      patterns: [{ from: './src/static/images', to: 'images' }],
    }),
  ],
  devServer: {
    open: ['/netflix-clone-web/react'],
    historyApiFallback: true,
    static: {
      directory: './src/static',
    },
    hot: true,
    port: 3000,
    proxy: {
      '/api': 'http://YOUR_API_URL:9000',
    },
  },
}
