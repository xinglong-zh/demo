const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成index.html
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;  /// boundle 分析工具
const CompressionPlugin = require("compression-webpack-plugin");  // 压缩文件 .gz
module.exports ={
    // entry:'./src/index.js',
    entry:{
        index:'./src/index.js',
    },
    devServer:{
        contentBase:'./dist',
        publicPath:'/',
        hot:true, // 开启模块热替换
    },
    output:{
        // filename:'[name].boundle.js',
        filename:'[name].[contenthash].js', // 使用hash缓存
        path:resolve(__dirname,'dist'),
        clean:true,  // 打包后清理dist,
        // https://webpack.docschina.org/guides/author-libraries/  打包类库配置
        // library:{
        //     name:'customLib',
        //     type:'umd',
        // }
    },
    mode:'development',
    module:{
        rules:[
            // 使用正则表达式来匹配对应的loader , 链式传递
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test:/\.js$/i,
                use:[
                    {
                        loader:'loader1',
                        options:{
                            test:'loader1 test'
                        }
                    },
                    {
                        loader:'loader2',
                        options:{
                            test:'loader1 test'
                        }
                    },
                    {
                        loader:'loader3',
                        options:{
                            test:'loader1 test'
                        }
                    },
            ]
            }
        ]
    },
    resolveLoader: {
        modules: ['node_modules', resolve(__dirname, 'loaders')],
      },
    // https://webpack.docschina.org/guides/scaffolding/
}