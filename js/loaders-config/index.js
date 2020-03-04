const pugRule = require('./pug');
const urlRule = require('./url');
const babelRule = require('./babel');
const styleRule = require('./style');
const manageImagesRule = require('./manage-images');

class LoadersConfig {

  constructor(isProd){
    this.isProd = isProd;
  }

  getPugRule = () => pugRule()
  getBabelRule = (config) => babelRule(config)
  getUrlRule = (config) => urlRule(this.isProd, config)
  getSassRule = (config) => { return this.isProd ? styleRule.prodSass(config) : styleRule.devSass(config) }
  getManageImagesRule = (options) => manageImagesRule(options)

}

module.exports = LoadersConfig;