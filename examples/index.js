const WebpackConfig = require('../js/webpack-config');

const webpackConfig = new WebpackConfig({
  env: 'production',
  dirname: __dirname,
});

console.log(webpackConfig.getConfig());
// console.log(JSON.parse(JSON.stringify(webpackConfig.getConfig())));
