# React + Webpack 搭建工程 总结

## 目录结构

### build

+ 配置文件  
+ webpack的 config文件
+ 其它工程需要用到的脚本文件

### client

+ 前端的文件

## WebPack 配置

### webpack.config.js

```js
//entry: 入口文件
    entry: {
        app: path.join(__dirname, '../client/app.js')
    }
```

#### publicPath: '/public/'

    /public 后面必须 有 /

```js
//output: 输出文件
    output: {
        filename: '[name].[hash].js',
        path: path.join(__dirname, '../dist'),//输出目录，默认为dist
        publicPath: '/public', //html 引用打包后的js时，url的前缀, 静态文件的 基础路径
        libraryTarget: 'commonjs2'//模块打包机制 配置如何暴露 library
    }
```

```js
//loader处理当前代码
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
    }
```

```js
//插件
    plugins: [
        // 生成一个html页面，同时把所有 entry打包后的 output 文件全部注入到这个html页面
        new HTMLPlugin({
            template: path.join(__dirname, '../client/template.html')
        })
    ]
```

### .babelrc 配置

```js
{
    "presets": [ "@babel/preset-env", "@babel/preset-react" ],
    "plugins": [
        "react-hot-loader/babel"
    ]
}  
```

+ @babel/core
+ @babel/preset-env: 处理ES6语法 
+ @babel/preset-react: 处理react语法

[babel 升级到7.X采坑总结](https://segmentfault.com/a/1190000016458913)

### webpack-dev-server启动一个开发服务器

在开发阶段，我们借用devServer启动一个开发服务器进行开发，这里也会配置一个publicPath，这里的publicPath路径下的打包文件可以在浏览器中访问。而静态资源仍然使用output.publicPath。

webpack-dev-server打包的内容是放在内存中的，这些打包后的资源对外的的根目录就是publicPath，换句话说，这里我们设置的是打包后资源存放的位置

```js
//
if(isDev){
    config.devServer = {
        hots: '0.0.0.0',
        port: '8888',
        contentBase: path.join(__dirname, '../dist'), //告诉服务器从哪个目录中提供内容
        hot: true,//启用 webpack 的模块热替换特性
        overlay: {//当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
            errors: true
        },
        publicPath: '/public',
        historyApiFallback: {
            index: '/public/index.html'
        }
    }
}
```

### [webpack 配置react-hot-loader热加载局部更新](https://blog.csdn.net/huangpb123/article/details/78556652)

webpack-dev-server 已经是热加载了，能做到只要代码修改了页面也自动更新了，为什么在 react 项目还要安装 react-hot-loader 呢？其实这两者的更新是有区别的，webpack-dev-server 的热加载是开发人员修改了代码，代码经过打包，重新刷新了整个页面。而 react-hot-loader 不会刷新整个页面，它只替换了修改的代码，做到了页面的局部刷新。但它需要依赖 webpack 的 HotModuleReplacement 热加载插件。

## 服务端渲染配置

1 首先把需要服务端渲染的内容，放到独立的文件内，如本项目的client-entry.js

2 client-entry.js需要单独打包，所以需要配置webpack.config.server.js(服务端webpack配置文件，注意比较两者不同之处)

3 后端创建一个server.js

```js
const ReactSSR = require('react-dom/server')
//注意后面的.default, 因为我们在server-entry.js中 是 export default <App />
const serverEntry = require('../dist/server-entry').default

const appString = ReactSSR.renderToString(serverEntry)
```

server.js 通过 fs 读取 html-webpack-plugin 根据template.html为模板生成的 /dist/index.html

用生成的appString 替换 <!--app-->, 并返回到前台

```js
res.send(template.replace('<!--app-->', appString))
```

4 index.html 内依赖的所有静态文件如js, 我们在output的时候 加上了 publicPlace 属性，
所以后端可以通过判断 url 是否以 '/public' 开头来 访问静态文件

```js
//所有 /public 的url 请求的都是静态文件， 这里用到的就是 webpack的 output中的 publicPath属性
app.use('/public', express.static(path.join(__dirname, '../dist')))  
```

## package.json

### rimraf

    rimraf 包的作用：以包的形式包装rm -rf命令，就是用来删除文件和文件夹的，不管文件夹是否为空，都可以删除
    rimraf 要删除的目录

### cross-env

    这个迷你的包(cross-env)能够提供一个设置环境变量的scripts，让你能够以unix方式设置环境变量，然后在windows上也能兼容运行。解决跨平台设置NODE_ENV的问题
    cross-env NODE_ENV=development
