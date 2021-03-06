const path =  require('path');
const webpack =  require('webpack');
const OptimizeCSSAssetsPlugin =  require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const clip = require('clipboardy');
const NotifierPlugin = require('webpack-notifier');
const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');

const stats = {
  all: false,
  assets: true,
  cachedAssets: true,
  children: false,
  chunks: false,
  entrypoints: true,
  errorDetails: true,
  errors: true,
  hash: true,
  modules: false,
  performance: true,
  publicPath: true,
  timings: true,
  warnings: false,
  exclude: [
    'node_modules'
  ]
};

module.exports = (env, argv) => {
  return {
    mode: 'development',
    entry: ['./src/main.js'],
    output: {
      filename: 'index.min.js',
      path: path.resolve(__dirname, 'docs')
    },
    resolve: {
      extensions: ['.js', '.json', '.css']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: '/node_modules/'
        }, {
          test: /\.css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ]
        }, {
          test: /\.(?:png|jpg|svg|gif)$/,
          loader: 'file-loader',
          options: {
            name: './img/[name].[ext]'
          }
        }
      ]
    },
    plugins: [
      new WebpackBar(),
      new NotifierPlugin({
        title: 'Minesweeper',
        alwaysNotify: true,
        skipFirstNotification: true
      }),
      new MiniCssExtractPlugin({
        filename: 'style.min.css',
        outputPath: 'dist'
      }),
      new HtmlWebpackPlugin({
        template: __dirname + '/src/index.ejs',
        inject: 'body'
      })
    ],
    devtool: '#source-map',
    performance: { hints: false },
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            discardComments: {
              removeAll: true
            },
            discardEmpty: true,
            discardOverridden: true
          }
        }),
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6,
          },
        })
      ]
    },
    stats: stats,
    devServer: {
      stats: stats,
      port: 4000,
      historyApiFallback: true,
      after: function(app, server) {
        clip.writeSync('http://localhost:4000/');
      }
    },
    node: {
      setImmediate: false,
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  }
}
