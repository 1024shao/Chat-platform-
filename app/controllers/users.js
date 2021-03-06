const jwt = require('jsonwebtoken')
const UserModel = require('../models/users')
const AnswerModel = require('../models/answers')
const { secret } = require('../config')

class UserCtl {
  async find (ctx) {
    //分页处理
    let { per_page = 10, page = 1 } = ctx.query
    page = Math.max(page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    ctx.body = await UserModel
      .find({ name: new RegExp(ctx.query.q) })
      .limit(perPage).skip(page * perPage)
      .populate('locations employments.company employments.job educations.school educations.major business')
  }
  async findById (ctx) {
    // 动态添加部分字段
    const { fields } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const populateStr = fields.split(';').filter(f => f).map(f => {
      if (f === 'employments') {
        return 'employments.job educations.school educations.major'
      }
      return f
    }).join(' ')
    const user = await UserModel.findById(ctx.params.id).select(selectFields)
      .populate(populateStr) // +educations+business

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
    if (ctx.params.id != ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  async updated (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headLine: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false }
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
  async listFollowing (ctx) {
    const user = await UserModel.findById(ctx.params.id).select('+following').populate('following')
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user.following
  }
  async listFollowers (ctx) {
    console.log('2')
    const users = await UserModel.find({ following: ctx.params.id })
    ctx.body = users
  }
  async checkUserExit (ctx, next) {
    try {
      const user = await UserModel.findById(ctx.params.id)
      if (!user) { ctx.throw(404, '用户不存在') }
      await next()
    } catch (error) {
      ctx.throw(404, 'id格式错误')
    }
  }
  async follow (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+following')
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  async unfollow (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+following')
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
  async listFollowTopics (ctx) {
    const user = await UserModel.findById(ctx.params.id).select('followTopics').populate('followTopics')
    if (!user) {
      ctx.throw(404, 'user is not found')
    }
    ctx.body = user.followTopics
  }
  async followTopic (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+followTopics')
    if (!me.followTopics.map(id => id.toString()).includes(ctx.params.id)) {
      me.followTopics.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  async unfollowTopic (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+followTopics')
    const index = me.followTopics.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.followTopics.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
  async listQuestions (ctx) {
    const questions = await UserModel.find({ questioner: ctx.params.id })
    ctx.body = questions
  }
  // 用户点赞的答案列表
  async listLikingAnswers (ctx) {
    const user = await UserModel.findById(ctx.state.user._id).select('+linkingAnswers').populate('linkingAnswers')
    if (!user) ctx.throw(404, 'user is not found')
    ctx.body = user.linkingAnswers
  }
  // 喜欢某个答案   点赞 
  async likeAnswer (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+linkingAnswers')
    let index = me.linkingAnswers.map(id => id.toString()).includes(ctx.params.id)
    if (index != -1) {
      me.linkingAnswers.push(ctx.params.id)
      me.save()
      // 修改某个id答案的 喜欢 次数
      await AnswerModel.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 } })
    }
    ctx.status = 204
  }
  // 取消对某个答案的喜欢
  async unlikeAnswer (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+linkingAnswers')
    let index = me.linkingAnswers.map(id => id.toString()).includes(ctx.params.id)
    if (index != -1) {
      me.linkingAnswers.splice(index, 1)
      me.save()
      // 修改某个id答案的 喜欢 次数
      await AnswerModel.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: -1 } })
    }
    ctx.status = 204
  }
  // 用户踩的答案列表
  async listDisLikingAnswers (ctx) {
    const user = await UserModel.findById(ctx.state.user._id).select('+disLinkingAnswers').populate('disLinkingAnswers')
    if (!user) ctx.throw(404, 'user is not found')
    ctx.body = user.disLinkingAnswers
  }
  async disLikeAnswer (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+disLinkingAnswers')
    let index = me.disLinkingAnswers.map(id => id.toString()).includes(ctx.params.id)
    if (index != -1) {
      me.disLinkingAnswers.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  // 取消对某个答案的踩
  async unDisLikeAnswer (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+linkingAnswers')
    let index = me.linkingAnswers.map(id => id.toString()).includes(ctx.params.id)
    if (index != -1) {
      me.linkingAnswers.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
  // 所有收藏的答案
  async listCollectionAnswers (ctx) {
    const user = await UserModel.findById(ctx.state.user._id).select('+collectionAnswers').populate('collectionAnswers')
    if (!user) ctx.throw(404, 'user is not found')
    ctx.body = user.collectionAnswers
  }
  // 收藏某个答案
  async collectAnswer (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+collectionAnswers')
    let index = me.collectionAnswers.map(id => id.toString()).includes(ctx.params.id)
    if (index != -1) {
      me.collectionAnswers.push(ctx.params.id)
      me.save()
      // 修改某个id答案的 喜欢 次数
    }
    ctx.status = 204
  }
  // 取消对某个答案的喜欢
  async unCollectAnswer (ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select('+collectionAnswers')
    let index = me.collectionAnswers.map(id => id.toString()).includes(ctx.params.id)
    if (index != -1) {
      me.collectionAnswers.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
}


module.exports = new UserCtl()