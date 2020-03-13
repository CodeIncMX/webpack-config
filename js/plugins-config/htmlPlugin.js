const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob');
const path = require('path');

class HtmlPlugin {

  constructor(options){
    this.templatesDir = options.templatesDir;
    this.indexName = options.indexName;
    this.faviconFile = options.faviconFile;
    this.finalHtmlName = options.finalHtmlName;
  }

  createPluginsList() {
    let htmlPluginsList = []

    glob.sync(`${this.templatesDir}/**/*.pug`).forEach( filePath => { 

      const htmlName = (this.finalHtmlName === 'FILE')
        ? path.basename(filePath, '.pug')
        : path.dirname(filePath).replace(this.templatesDir, '').replace('/','');

      const pluginConf = {
        template: `${filePath}`,
        filename: (this.indexName == htmlName) ? 'index.html' : `${htmlName}.html`,
        favicon: `${this.faviconFile}`
      }

      htmlPluginsList.push(new HtmlWebpackPlugin(pluginConf))
    })

    return htmlPluginsList
  }

}

module.exports = HtmlPlugin;