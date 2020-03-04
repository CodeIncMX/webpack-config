const rule = () => {
    return {
        test: /\.pug$/,
        use:'pug-loader'
    }
}

module.exports = rule;