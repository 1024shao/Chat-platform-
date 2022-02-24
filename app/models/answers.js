const mongoose = require('mongoose')
const { Schema, model } = mongoose

const answerSchema = new Schema({
  __v: { type: 'number', select: false },
  content: { type: 'string', required: true },
  answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: {  // 一个问题对应 多个答案，一个答案只能从属于一个问题
    type: String,
    required: true
  },
  voteCount: {
    type: 'number', required: true, default: 0
  }
})


module.exports = model('Answer', answerSchema)