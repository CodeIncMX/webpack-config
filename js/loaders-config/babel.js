const babelRule = (options) => {
  return{
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options,
    },
  }
}

module.exports = babelRule;