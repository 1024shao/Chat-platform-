const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const error = require('koa-json-error')
const mongoose = require('mongoose')
const parameter = require('koa-parameter')
const app = new Koa()
const routing = require('./routes')
const { connectionStr } = require('./config')

mongoose.connect(connectionStr, () => {
  console.log('mongodb连接成功！')
})
mongoose.connection.on('error', console.error)

app.use(error({
  postFormat: (err, { stack, ...reset }) => process.env.NODE_ENV === 'production'
    ? reset : { stack, ...reset }
}))
app.use(parameter(app))
app.use(bodyParser())
routing(app)

app.listen(3000, () => console.log('服务已经启动'));


