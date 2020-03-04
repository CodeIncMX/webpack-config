const glob = require('glob');
const path = require('path');
const LoadersConfig = require('./loaders-config');
const PluginsConfig = require('./plugins-config');

class WebpackConfig {

  constructor(config = {}) {
    this.env = config.env || 'production';
    this.isProd = this.env  === 'production' ? true : false;
    this.buildFolder = config.buildFolder || './dist'
    this.entriesPath = config.entriesPath || './src/js'
    this.jsBuildNameFolder = config.jsBuildNameFolder || 'js'
    this.jsTranspilation = config.jsTranspilation || { 
      plugins: [ '@babel/plugin-transform-runtime' ], 
      presets: [ '@babel/preset-env' ] 
    } // For deactivate use -> false
    this.gzipCompress = config.gzipCompress || true
    this.criticalCss = config.criticalCss || true // { base: util.build() }
    this.useAutoprefixer = config.useAutoprefixer || true
    this.cleanBeforeBuild = config.cleanBeforeBuild || true
    this.manageImageOptions = config.manageImageOptions || { quality: 70 } // Options only apply for webp images created //For deactivate use -> false
    this.minifyCss = config.minifyCss || { filename: 'css/[name]-[hash].css' } // Only applies in production mode. For deactivate use false
    this.compressImages = config.compressImages || {pngquant: { quality: '65-90' } } //For deactivate use -> false
    this.urlOptions = config.urlOptions || { limit: 1000, outputPath: 'assets' } // For deactivate images in b64 use -> { limit: false }
    this.jsGlobalVariables = config.jsGlobalVariables || { IS_PROD: this.isProd }
    this.sassOptions = config.sassOptions || { prependData: `$IS_PROD: ${this.isProd};` } // For deactivate use --> false || true if not want yni options
    this.pugOptions = config.pugOptions || {
      templatesDir: 'src/pug/UI/pages',
      indexFilename: 'home.pug',
    }// For deactivate use of pug false
    this.purgeCss = config.purgeCss || {
      paths: 'src/pug/**/*',
      whitelistPatterns: [/webp--disabled/] // For deactivate use -> false
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
      // optimization: { minimizer: env.production ? optimization.getOptimization : [] },
    }
  }

  getPlugins() {
    // plugins: plugins.getPlugins(env.production),
    let pluginsList = []
    const pc = new PluginsConfig(this.isProd);

    if (this.jsGlobalVariables) { pluginsList.push( pc.setJsGlobalVariables(this.jsGlobalVariables)); }

    if (this.isProd) {
      if (this.cleanBeforeBuild) { pluginsList.push(pc.setCleanBuild()); }
      if (this.compressImages) { pluginsList.push(pc.setImageCompression(this.compressImages)); }
      if (this.useAutoprefixer) { pluginsList.push(pc.setAutoprefixer()); }
      if (this.minifyCss) { pluginsList.push(pc.setCssMinification(this.minifyCss)) }
      if (this.pugOptions) { pc.getPugPlugins(this.pugOptions).forEach( plugin => { pluginsList.push(plugin) }) }
      if (this.criticalCss) { pluginsList.push(pc.setExtractCriticalCss(typeof this.criticalCss === 'object' ? this.criticalCss : false)) }
      if (this.purgeCss) { pluginsList.push(pc.setPurgeCss(this.purgeCss)) }
      if (this.gzipCompress) { pluginsList.push(pc.setGZipCompression()) } 
    } else {
      if (this.useAutoprefixer) { pluginsList.push(pc.setAutoprefixer()); }
      if (this.pugOptions) { pc.getPugPlugins(this.pugOptions).forEach( plugin => { pluginsList.push(plugin) }) }

    }

    return pluginsList;
  }

  getModule() {
      const rules = [];
      const lc = new LoadersConfig(this.isProd);

      if (this.pugOptions) { rules.push(lc.getPugRule()) } 
      if (this.urlOptions ) { rules.push(lc.getUrlRule( this.urlOptions )) }
      if (this.jsTranspilation) { rules.push(lc.getBabelRule(this.jsTranspilation)) }
      if (this.manageImageOptions) { rules.push(lc.getManageImagesRule( this.manageImageOptions )) }
      if (this.sassOptions) { rules.push(lc.getSassRule(typeof this.sassOptions === 'object' ? this.sassOptions : false )) }

      return { rules }
  }

  getOutput() {
      return {
        path: path.resolve(__dirname, this.buildFolder),
        filename: `${this.jsBuildNameFolder}/[name]${ this.isProd ? '-[hash]': '' }.js`,
        publicPath: '/'
      };
  }

  getEntry() {
    let entries = {}
    glob.sync(`${this.entriesPath}/*.js`).forEach( filePath => {
      const fileName = path.basename(filePath,'.js');
      entries[fileName] = filePath;
    })
    return entries;
  }

}

module.exports = WebpackConfig;