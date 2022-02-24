const AnswerModel = require('../models/questions')

class AnswersCtl {
  async find (ctx) { //查询所有话题
    //分页处理
    let { per_page = 3, page = 1 } = ctx.query
    page = Math.max(page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    // limit 限制一页的数量, page当前页码-1
    // find高级检索 可以接受一个对象，对象中传入正则进行模糊匹配，也可以直接传入某个值进行精准匹配
    ctx.body = await AnswerModel
      .find({ content: new RegExp(ctx.query.q), questionId: ctx.params.questionId })
      .limit(perPage).skip(page * perPage)
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    let selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const Answer = await AnswerModel.findById(ctx.params.id).select(selectFields).populate('answerer ')
    ctx.state.answer = Answer
    if (!Answer) {
      ctx.throw(404, '找不到该话题')
    }
    ctx.body = Answer
  }
  async checkAnswerer (ctx, next) {
    const { answer } = ctx.state
    if (answer.questioner.toString() != ctx.state.user._id) { ctx.throw(403, '没有权限') }
    await next()
  }
  async checkAnswerExit (ctx, next) {
    try {
      const Answer = await AnswerModel.findById(ctx.params.id).select('+answerer')
      // 校验答案是否在问题下
      if (Answer.questionId !== ctx.params.id) {
        ctx.throw(404, '该问题下没有子答案')
      }
      await next()
    } catch (error) {
      ctx.throw(422, 'Answer id unValid')
    }
  }
  async create (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      content: { type: "string", required: true },
    })
    const Answer = new AnswerModel({
      ...ctx.request.body, answerer: ctx.state.user._id,
      questionId: ctx.params.id
    }).save()
    ctx.body = Answer
  }
  async update (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      content: { type: "string", required: true },
    })
    await ctx.state.answer.update(ctx.request.body)
    ctx.body = ctx.state.answer
  }
  async remove (ctx) {
    await AnswerModel.findOneAndRemove(ctx.params.id)
    ctx.status = 204
  }

}


module.exports = new AnswersCtl()