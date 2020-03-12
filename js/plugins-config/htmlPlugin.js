const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob');
const path = require('path');

class HtmlPlugin {

  constructor(options){
    this.templatesDir = options.templatesDir;
    this.indexFilename = options.indexFilename;
    this.faviconFile = options.faviconFile;
  }

  createPluginsList() {
    let htmlPluginsList = []

    glob.sync(`${this.templatesDir}/*.pug`).forEach( filePath => {
      const filename = path.basename(filePath);
      const filenameWithoutExt = path.basename(filePath, '.pug');
      const pluginConf = {
        template: `${this.templatesDir}/${filename}`,
        filename: (this.indexFilename == filename) ? 'index.html' : `${filenameWithoutExt}.html`,
        favicon: `${this.faviconFile}`
      }
      htmlPluginsList.push(new HtmlWebpackPlugin(pluginConf))
    })

    return htmlPluginsList
  }

}

module.exports = HtmlPlugin;