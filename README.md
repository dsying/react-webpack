#

## 目录结构

### build

+ 配置文件  
+ webpack的 config文件
+ 其它工程需要用到的脚本文件

### client

+ 前端的文件

## WebPack 配置

### webpack.config.js

+ entry: 入口文件
+ output: 输出文件
    + filename: '[name].[hash].js'
    + path: 输出目录，默认为dist
    + publicPath: '/public' html引用打包后的js时，url的前缀
+ module：loader处理当前代码
    + bable-loader: 处理jsx,处理ES6语法
+ plugins：
    + html-webpack-plugin: 默认生成一个index.html，并引入把所有output的js

### .babelrc 配置
+@babel/preset-env: 处理ES6语法 
+@babel/preset-react: 处理react语法
[babel 升级到7.X采坑总结](https://segmentfault.com/a/1190000016458913)