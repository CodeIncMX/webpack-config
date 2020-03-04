const WebpackConfig = require('../js/webpack-config');

const webpackConfig = new WebpackConfig({
  env: 'production'
});

console.log(webpackConfig.getConfig());
// console.log(JSON.parse(JSON.stringify(webpackConfig.getConfig())));
