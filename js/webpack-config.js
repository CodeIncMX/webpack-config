const glob = require('glob');
const path = require('path');
const LoadersConfig = require('./loaders-config');
const PluginsConfig = require('./plugins-config');
const optimization = require('./optimization-config')

class WebpackConfig {

  constructor(config = {}) {

    if(!config.dirname ) { throw new Error(`It's necessary pass config.dirname value for WebpackConfig class`) }

    this.dirname = config.dirname;
    this.env = config.env.production ? 'production' : 'development' || 'production';
    this.isProd = this.env  === 'production';
    this.buildFolder = config.buildFolder || 'dist'
    this.entries = config.entries || {
      path: './src/Pages',
      finalJsName: 'DIR'
    }
    this.jsBuildNameFolder = config.jsBuildNameFolder || 'js'
    this.jsTranspilation = config.jsTranspilation || {
      plugins: [ '@babel/plugin-transform-runtime' ],
      presets: [ '@babel/preset-env' ]
    } // For deactivate use -> 'disabled'
    this.gzipCompress = config.gzipCompress || true
    this.criticalCss = config.criticalCss || { base: path.resolve(this.dirname, this.buildFolder)}
    this.useAutoprefixer = config.useAutoprefixer || true
    this.cleanBeforeBuild = config.cleanBeforeBuild || true
    this.manageImageOptions = config.manageImageOptions || { quality: 70 } // Options only apply for webp images created //For deactivate use -> 'disabled'
    this.minifyCss = config.minifyCss || { filename: 'css/[name]-[hash].css' } // Only applies in production mode. For deactivate use 'disabled'
    this.compressImages = config.compressImages || {pngquant: { quality: '65-90' } } //For deactivate use -> 'disabled'
    this.urlOptions = config.urlOptions || { limit: 1000, outputPath: 'assets' } // For deactivate images in b64 use -> { limit: false }
    this.jsGlobalVariables = config.jsGlobalVariables || { IS_PROD: this.isProd }
    this.sassOptions = config.sassOptions || { prependData: `$IS_PROD: ${this.isProd};` } // For deactivate use --> 'disabled' || true if not want yni options
    this.pugOptions = config.pugOptions || {
      templatesDir: 'src/Pages',
      finalHtmlName: 'DIR', // Takes de dir name for the html result -> use 'FILE0 in order it takes the pug file name as html final name
      indexName: 'home',
      faviconFile: 'src/favicon.png',
    }// For deactivate use of pug 'disabled'
    this.purgeCss = config.purgeCss || {
      paths: glob.sync(`${path.resolve(this.dirname, 'src')}/**/*`, {nodir:true}),
      whitelistPatterns: [/webp--disabled/] // For deactivate use -> 'disabled'
    }
  }

  getConfig(){
    return {
      mode: this.env,
      devtool: this.isProd ? 'hidden-source-map' : 'cheap-source-map',
      entry: this.getEntry(),
      output: this.getOutput(),
      module: this.getModule(),
      plugins: this.getPlugins(),
      optimization: this.getOptimization(),
    }
  }

  getOptimization() {
    return {
      minimizer: this.isProd ? optimization.getOptimizationList : []
    }
  }

  getPlugins() {
    let pluginsList = []
    const pc = new PluginsConfig(this.isProd);


    if (this.isProd) {
      if (this.cleanBeforeBuild !== 'disabled') { pluginsList.push(pc.setCleanBuild()); }
      if (this.compressImages !== 'disabled') { pluginsList.push(pc.setImageCompression(this.compressImages)); }
      if (this.useAutoprefixer !== 'disabled') { pluginsList.push(pc.setAutoprefixer()); }
      if (this.minifyCss !== 'disabled') { pluginsList.push(pc.setCssMinification(this.minifyCss)) }
      if (this.pugOptions !== 'disabled') { pc.getPugPlugins(this.pugOptions).forEach( plugin => { pluginsList.push(plugin) }) }
      if (this.criticalCss !== 'disabled') { pluginsList.push(pc.setExtractCriticalCss(typeof this.criticalCss === 'object' ? this.criticalCss : false)) }
      if (this.purgeCss !== 'disabled') { pluginsList.push(pc.setPurgeCss(this.purgeCss)) }
      if (this.gzipCompress !== 'disabled') { pluginsList.push(pc.setGZipCompression()) }
    } else {
      if (this.useAutoprefixer !== 'disabled') { pluginsList.push(pc.setAutoprefixer()); }
      if (this.pugOptions !== 'disabled') { pc.getPugPlugins(this.pugOptions).forEach( plugin => { pluginsList.push(plugin) }) }

    }

    if (this.jsGlobalVariables) { pluginsList.push( pc.setJsGlobalVariables(this.jsGlobalVariables)); }

    return pluginsList;
  }

  getModule() {
      const rules = [];
      const lc = new LoadersConfig(this.isProd);

      if (this.pugOption !== 'disabled') { rules.push(lc.getPugRule()) } 
      if (this.manageImageOptions !== 'disabled') { rules.push(lc.getManageImagesRule( this.manageImageOptions )) }
      if (this.urlOptions ) { rules.push(lc.getUrlRule( this.urlOptions )) }
      if (this.jsTranspilation !== 'disabled') { rules.push(lc.getBabelRule(this.jsTranspilation)) }
      if (this.sassOptions !== 'disabled') { rules.push(lc.getSassRule(typeof this.sassOptions === 'object' ? this.sassOptions : false )) }

      return { rules }
  }

  getOutput() {
      return {
        path: path.resolve(this.dirname, this.buildFolder),
        filename: `${this.jsBuildNameFolder}/[name]${ this.isProd ? '-[hash]': '' }.js`,
        publicPath: '/'
      };
  }

  getEntry() {
    let entries = {}
    glob.sync(`${this.entries.path}/**/*.js`).forEach( filePath => {

      const jsName = (this.entries.finalJsName === 'FILE')
        ? path.basename(filePath, '.js')
        : path.dirname(filePath).replace(this.entries.path, '').replace('/','');

      entries[jsName] = filePath;
    })

    return entries;
  }

}

module.exports = WebpackConfig;