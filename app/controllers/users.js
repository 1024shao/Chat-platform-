const jwt = require('jsonwebtoken')
const UserModel = require('../models/users')
const { secret } = require('../config')

class UserCtl {
  async find (ctx) {
    ctx.body = await UserModel.find()
  }
  async findById (ctx) {
    const user = await UserModel.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, ' user is not found')
    }
    ctx.body = user
  }
  async create (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const { name } = ctx.request.body
    const repeatUser = await UserModel.findOne({ name })
    console.log(repeatUser)
    if (repeatUser) {
      ctx.throw(409, '该用户名已经存在')
    }
    const user = await new UserModel(ctx.request.body).save()
    ctx.body = user
  }
  async del (ctx) {
    const user = await UserModel.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.status = 204
  }
  async checkOwner (ctx, next) {
    console.log(ctx.state.user, '---check')
    console.log(ctx.params.id, ctx.state.user._id)
    if (ctx.params.id != ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  async updated (ctx) {
    console.log(ctx.state.user)
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false }
    })
    if (ctx.request.body.name) {
      const { name } = ctx.request.body
      const updateUser = await UserModel.findOne({ name })
      if (updateUser) {
        ctx.throw(404, '修改的用户名已经存在')
      }
    }
    const user = await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, 'user is not found')
    }
    ctx.body = { message: '修改成功', user }
  }
  async login (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await UserModel.findOne(ctx.request.body)
    console.log(user)
    if (!user) ctx.throw(401, '用户名或密码错误')
    const { _id, name } = user
    const token = jwt.sign({ _id, name }, secret, { expiresIn: '2h' })
    ctx.body = { token }
  }
}


module.exports = new UserCtl()