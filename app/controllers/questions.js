const QuestionModel = require('../models/questions')

class QuestionsCtl {
  async find (ctx) { //查询所有话题
    //分页处理
    let { per_page = 3, page = 1 } = ctx.query
    page = Math.max(page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    // limit 限制一页的数量, page当前页码-1
    ctx.body = await QuestionModel
      .find({ name: new RegExp(ctx.query.q) })
      .limit(perPage).skip(page * perPage)
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    let selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const Question = await QuestionModel.findById(ctx.params.id).select(selectFields).populate('questioner')
    ctx.state.question = Question
    if (!Question) {
      ctx.throw(404, '找不到该话题')
    }
    ctx.body = Question
  }
  // async checkExit (ctx, next) {
  //   try {
  //     const Question = await QuestionModel.findById(ctx.params.id)
  //     await next()
  //   } catch (error) {
  //     console.log(error)
  //     ctx.throw(422, 'Question id unValid')
  //   }
  // }
  async checkQuestioner (ctx, next) {
    const { question } = ctx.state
    if (question.questioner.toString() != ctx.state.user._id) { ctx.throw(403, '没有权限') }
    await next()
  }
  async checkQuestionExit (ctx, next) {
    try {
      const Question = await QuestionModel.findById(ctx.params.id).select('+questioner')
      await next()
    } catch (error) {
      ctx.throw(422, 'Question id unValid')
    }
  }
  async create (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      description: { type: "string", required: false },
    })
    const Question = new QuestionModel({ ...ctx.request.body, questioner: ctx.state.user._id }).save()
    ctx.body = Question
  }
  async update (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      description: { type: "string", required: false },
    })
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question
  }
  async remove (ctx) {
    await QuestionModel.findOneAndRemove(ctx.params.id)
    ctx.status = 204
  }

}


module.exports = new QuestionsCtl()