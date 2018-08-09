const path =  require('path');
const webpack =  require('webpack');
const OptimizeCssAssetsPlugin =  require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: [
    './src/main.js'
  ],
  output: {
    filename: 'dist/index.min.js',
    path: path.resolve(__dirname, 'docs'),
    publicPath: path.resolve(__dirname, 'docs')
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
          name: '/img/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'dist/style.min.css'
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
  devtool: 'source-map'
};
