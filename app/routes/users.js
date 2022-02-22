const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const router = new Router({ prefix: '/users' })
const { find, del, create, updated, findById, login, checkOwner } = require('../controllers/users')
const { secret } = require('../config')

//定义认证中间件
const auth = (async (ctx, next) => {
  const { authorization = '' } = ctx.request.header // 赋初始值做短路处理
  const token = authorization.replace('Bearer ', '')
  try {
    const user = jwt.verify(token, secret)
    ctx.state.user = user // 存储用户信息
    console.log(user)
  } catch (error) {
    ctx.throw(401, error.message)
  }
  await next()
})

router.get('/', find)

router.get('/:id', findById)

router.post('/', create)

router.delete('/:id', auth, checkOwner, del)

router.patch('/:id', auth, checkOwner, updated)

router.post('/login', login)

module.exports = router
