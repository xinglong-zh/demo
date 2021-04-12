const { resolve } = require('path')

module.exports = {
    entry: '/src/index.js',
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dist'),
        clean: true,
    },
    mode: 'production',
    module:{
        rules:[
            {
                test:/\.js$/i,
                // use:['loader01.js','loader01.js','loader01.js']
                loader:'loader01.js'
            }
        ]
    },
    resolveLoader: {
        modules: ['node_modedules', resolve(__dirname, 'loaders')]
    }

}