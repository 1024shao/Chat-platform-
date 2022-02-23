const Koa = require('koa')
const koaBody = require('koa-body')
const error = require('koa-json-error')
const mongoose = require('mongoose')
const koaStatic = require('koa-static')
const path = require('path')
const parameter = require('koa-parameter')
const app = new Koa()
const routing = require('./routes')
const { connectionStr } = require('./config')

mongoose.connect(connectionStr, () => {
  console.log('mongodb连接成功！')
})
mongoose.connection.on('error', console.error)

app.use(koaStatic(path.join(__dirname, '/public')))

app.use(error({
  postFormat: (err, { stack, ...reset }) => process.env.NODE_ENV === 'production'
    ? reset : { stack, ...reset }
}))
app.use(parameter(app))
app.use(koaBody({
  multipart: true, // 设置支持文件类型 
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'), // 指定文件保留目录
    keepExtensions: true //保留文件拓展名
  }
}))
routing(app)

app.listen(3000, () => console.log('服务已经启动'));


