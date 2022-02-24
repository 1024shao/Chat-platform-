const CommentModel = require('../models/comments')

class CommentsCtl {
  async find (ctx) { //查询所有话题
    //分页处理
    let { per_page = 3, page = 1 } = ctx.query
    page = Math.max(page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    // limit 限制一页的数量, page当前页码-1
    // find高级检索 可以接受一个对象，对象中传入正则进行模糊匹配，也可以直接传入某个值进行精准匹配
    const { questionId, answerId } = ctx.params
    const { rootCommentId } = ctx.query
    ctx.body = await CommentModel
      .find({
        content: new RegExp(ctx.query.q), questionId: questionId,
        answerId: answerId, rootCommentId: rootCommentId
      })
      .limit(perPage).skip(page * perPage)
      .populate('commentator replyTo')
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    let selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const Comment = await CommentModel.findById(ctx.params.id).select(selectFields).populate('commentator')
    ctx.state.comment = Comment
    if (!Comment) {
      ctx.throw(404, '评论不存在')
    }
    ctx.body = Comment
  }
  async checkCommentator (ctx, next) {
    const { comment } = ctx.state
    if (comment.commentator.toString() != ctx.state.user._id) { ctx.throw(403, '没有权限') }
    await next()
  }
  async checkCommentExit (ctx, next) {
    try {
      const Comment = await CommentModel.findById(ctx.params.id).select('+answerer')
      // 校验答案是否在问题下
      if (Comment.questionId !== ctx.params.questionId) {
        ctx.throw(404, '该问题下没有此评论')
      }
      if (Comment.answerId !== ctx.params.answerId) {
        ctx.throw(404, '该答案下没有此评论')
      }
      await next()
    } catch (error) {
      ctx.throw(422, 'Comment id unValid')
    }
  }
  async create (ctx) {
    ctx.verifyParams({
      content: { type: "string", required: true },
      rootCommentId: { type: "string", required: false },
      replyTo: { type: "string", required: false },
    })
    const Comment = new CommentModel({
      ...ctx.request.body, answerer: ctx.state.user._id,
      questionId: ctx.params.questionId
    }).save()
    ctx.body = Comment
  }
  async update (ctx) {
    ctx.verifyParams({
      content: { type: "string", required: true },
    })
    await ctx.state.comment.update(ctx.request.body)
    ctx.body = ctx.state.comment
  }
  async remove (ctx) {
    await CommentModel.findOneAndRemove(ctx.params.id)
    ctx.status = 204
  }

}


module.exports = new CommentsCtl()