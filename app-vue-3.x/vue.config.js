module.exports = {
    publicPath: './',
    productionSourceMap: true,
    indexPath: 'index.html',
    devServer: {
        open: 'index',
        port: 3000,
        // https: true,
        compress: false,
        proxy: {
            '^api': {
                target: 'baidu.com',
                ws: true,
                changeOrigin: true
            }
        }
    },
    lintOnSave:'error',
}