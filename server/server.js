const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
//注意后面的.default, 因为我们在server-entry.js中 是 export default <App />
const serverEntry = require('../dist/server-entry').default

const app = express()
const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
console.log(serverEntry);

//所有 /public 的url 请求的都是静态文件， 这里用到的就是 webpack的 output中的 publicPath属性
app.use('/public', express.static(path.join(__dirname, '../dist')))

app.get('*', (req, res) => {
    const appString = ReactSSR.renderToString(serverEntry)
    res.send(template.replace('<!--app-->', appString))
})

app.listen(3333, () => console.log('server is starting on port 3333'))
