const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

exports.getOptimizationList = [
    new TerserJSPlugin(),
    new OptimizeCSSAssetsPlugin()
  ]
