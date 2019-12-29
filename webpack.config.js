const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'frontend', 'app.jsx'),
  output: {
    publicPath: "/"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Spaced Repetition Cheat Sheet"
    }),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['@babel/react']
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "dist"),
    proxy: {
      '/api': 'http://localhost:8001',
      changeOrigin: true
    }
  }
}
