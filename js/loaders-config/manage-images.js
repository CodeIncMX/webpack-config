
rule = (options) => {

  return {
    test: /\.png|jpg$/,
    use: {
      loader: '@codeinc.mx/manage-images-loader',
      options
    }
  }
}

module.exports = rule;
