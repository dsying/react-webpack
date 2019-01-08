const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
    //入口
    entry: {
        app: path.join(__dirname, '../client/app.js')
    },
    //出口
    output: {
        filename: '[name].[hash].js', // 文件更改后重新打包，hash值变化，从而刷新缓存
        path: path.join(__dirname, '../dist'),
        //很重要
        publicPath: '', 
    },
    module: {
        rules: [
            {   //将jsx转换成 js
                test: /.jsx$/,
                loader: 'babel-loader'  
            },
            {   //将ES6语法转成 低版本语法
                test: /.js$/,
                loader: 'babel-loader',
                exclude: [//排除node_modules 下的js
                    path.join(__dirname,'../node_modules')
                ]  
            }
        ]
    },
    plugins: [
        // 生成一个html页面，同时把所有 entry打包后的 output 文件全部注入到这个html页面
        new HTMLPlugin()
    ],
    //开发模式
    mode: 'development',
}