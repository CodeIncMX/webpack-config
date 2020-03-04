const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

const use = [
    'css-loader',
    'postcss-loader'
]

const devSass = (options) => {
    use.unshift('style-loader')
    use.push( options ? { loader: 'sass-loader', options } : 'sass-loader')
    return { test: /\.scss$/, use }
}

const prodSass = (options) => {
    use.unshift({ loader: MiniCSSExtractPlugin.loader, options: { publicPath:  '/' } })
    use.push( options ? { loader: 'sass-loader', options } : 'sass-loader')
    return { test: /\.scss$/, use }
}

module.exports = { 
    prodSass,
    devSass
};