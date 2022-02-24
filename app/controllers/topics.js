const TopicModel = require('../models/topics')
const QuestionModel = require('../models/questions')
class TopicsCtl {
  async find (ctx) { //查询所有话题
    //分页处理
    let { per_page = 3, page = 1 } = ctx.query
    page = Math.max(page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    // limit 限制一页的数量, page当前页码-1
    ctx.body = await TopicModel
      .find({ name: new RegExp(ctx.query.q) })
      .limit(perPage).skip(page * perPage)
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    let selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const topic = await TopicModel.findById(ctx.params.id).select(selectFields)
    if (!topic) {
      ctx.throw(404, '找不到该话题')
    }
    ctx.body = topic
  }
  async checkExit (ctx, next) {
    try {
      const topic = await TopicModel.findById(ctx.params.id)
      await next()
    } catch (error) {
      console.log(error)
      ctx.throw(422, 'topic id unValid')
    }
  }
  async checkTopicExit (ctx, next) {
    try {
      const topic = await TopicModel.findById(ctx.params.id)
      await next()
    } catch (error) {
      ctx.throw(422, 'topic id unValid')
    }
  }
  async create (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false }
    })
    const topic = new TopicModel(ctx.request.body).save()
    ctx.body = topic
  }
  async update (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false }
    })
    const topic = await TopicModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = topic
  }
  async listQuestions (ctx) {
    const questions = await QuestionModel.find({ topics: ctx.params.id })
    ctx.body = questions
  }

}


module.exports = new TopicsCtl()