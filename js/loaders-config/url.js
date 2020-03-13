rule = (isProd, { limit, outputPath })  => {
  return {
      test: /\.jpg|png|gif|woff|eot|ttf|svg|mp4|webm|webp$/,
      use: {
          loader: 'url-loader',
          options:{
              limit,
              name: isProd ? '[name]-[hash].[ext]' : '[name].[ext]',
              outputPath,
          }
      }
  }
}

module.exports = rule;