const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'frontend', 'main.jsx'),
  plugins: [
    new HtmlWebpackPlugin({
      title: "Spaced Repetition Cheat Sheet"
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8001'
    }
  }
}
