const paths = require('./paths')
var webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const preprocessor = {
  DEV: true,
};

const ifdef_query = require('querystring').encode(preprocessor);

module.exports = {

  entry: {
    app: ['babel-polyfill', paths.js + '/main.js'],
  },
  

  output: {
    path: paths.build,
    filename: 'main.js',
    publicPath: '/',
  },

  plugins: [

    new CleanWebpackPlugin(),
    
    // new webpack.DefinePlugin({
    //   __DEV: JSON.stringify(true)
    // }),
    // new webpack.NormalModuleReplacementPlugin(
    //   "/some\/path\/config\.development\.js/",
    //   './config.production.js'
    // ),

    new CopyWebpackPlugin([
      {
        from: paths.static,
        ignore: ['*.DS_Store'],
      },
      {
        from: paths.src + '/custom.html',
      },
    ]),

    new HtmlWebpackPlugin({
      title: 'Voodoo Three Template',
      favicon: paths.static + '/gameIcon.png',
      template: paths.src + '/development.html',
      filename: 'index.html',
      templateParameters: require(paths.static + '/config.json')
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: `ifdef-loader?${ifdef_query}`,
        },
      },

      {
        test: /\.(scss|css|sass)$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },

      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        loader: 'url-loader',
        options: {
          name: '[path][name].[ext]',
          context: 'src',
          encoding: 'base64'
        },
      },

      {
        test: /\.(glb|gltf)$/i,
        loader: 'url-loader',
        options: {
          name: '[path][name].[ext]',
          context: 'src',
          encoding: 'base64'
        },
      },

      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        loader: 'url-loader',
        options: {
          name: '[path][name].[ext]',
          context: 'src',
          encoding: 'base64'
        },
      },
    ],
  },
}
