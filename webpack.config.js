module.exports = {
  devtool: "source-map",
  entry: './index.js',
  output: {
    filename: './serverstate.min.js',
    library: 'serverState'
  },
  externals: {
    jquery: 'jQuery'
  }
};