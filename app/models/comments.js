const mongoose = require('mongoose')
const { Schema, model } = mongoose

const CommentSchema = new Schema({
  __v: { type: 'number', select: false },
  content: { type: "string", required: true },
  commentator: { type: Schema.Types.ObjectId, ref: 'User' },
  questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  AnswerId: { type: Schema.Types.ObjectId, ref: 'Answer', required: true },
  rootCommentId: { type: 'string', required: false },
  replyTo: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })


module.exports = model('Comment', CommentSchema)