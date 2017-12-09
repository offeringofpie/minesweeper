import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';

export default {
  entry: [
    './src/main.js'
  ],
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, 'public/dist')
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false,
                importLoaders: 1
              }
            },
            'postcss-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
    new ExtractTextPlugin('style.min.css'),
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
  watch: true
};
