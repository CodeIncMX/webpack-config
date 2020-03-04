const HtmlPlugin = require('./htmlPlugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const PurgeCssPlugin = require('purgecss-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CriticalCssPlugin = require('critical-css-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

class PluginsConfig {
  constructor(isProd) {
    this.isProd = isProd;
  }

  getPugPlugins = (options) => new HtmlPlugin(options).createPluginsList()

  setCleanBuild = () =>  new CleanWebpackPlugin()
  setPurgeCss = (options) => new PurgeCssPlugin(options)
  setExtractCriticalCss = (options) => new CriticalCssPlugin(options ? options : {})
  setImageCompression = (options) => new ImageminPlugin(options)
  setCssMinification = (options) => new MiniCSSExtractPlugin(options)
  setJsGlobalVariables = (definitions) =>  new webpack.DefinePlugin(definitions)
  setGZipCompression = () => new CompressionPlugin( {test: /\.js|css$/, filename: '[path].gz'} )
  setAutoprefixer = () => new webpack.LoaderOptionsPlugin({ options: { postcss: [autoprefixer()] } })

}

module.exports = PluginsConfig;