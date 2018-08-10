const path =  require('path');
const webpack =  require('webpack');
const OptimizeCssAssetsPlugin =  require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  return {
    mode: 'development',
    entry: ['./src/main.js'],
    output: {
      filename: 'dist/index.min.js',
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
            name: 'dist/img/[name].[ext]'
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.min.css'
      }),
      new HtmlWebpackPlugin({
        template: __dirname + '/src/index.ejs',
        inject: 'body'
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.min\.css$/g,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          },
          discardEmpty: true,
          discardOverridden: true
        }
      })
    ],
    devtool: 'source-map',
    performance: { hints: false },
    serve: {
      contentBase: path.join(__dirname, 'docs'),
      compress: true,
      host: '0.0.0.0',
      port: 4000,
      hot: {
        logLevel: 'info',
        logTime: true
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
