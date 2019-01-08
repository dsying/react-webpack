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
 
+ @babel/preset-env: 处理ES6语法 
+ @babel/preset-react: 处理react语法

[babel 升级到7.X采坑总结](https://segmentfault.com/a/1190000016458913)


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

用生成的appString 替换 <app></app>, 并返回到前台
```js
res.send(template.replace('<app></app>', appString))
```

4 index.html内依赖的所有静态文件如js, 我们在output的时候 加上了 publicPlace 属性，
所以后端可以通过判断 url 是否以 '/public' 开头来 访问静态文件
```js
//所有 /public 的url 请求的都是静态文件， 这里用到的就是 webpack的 output中的 publicPath属性
app.use('/public', express.static(path.join(__dirname, '../dist'))) 

