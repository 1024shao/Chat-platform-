const mongoose = require('mongoose')
const { Schema, model } = mongoose

const questionSchema = new Schema({
  __v: { type: 'number', select: false },
  title: { type: 'string', required: true },
  description: { type: 'string' },
  questioner: { type: Schema.Types.ObjectId, ref: "User", required: true, select: false },
  topics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false
  }
})


module.exports = model('Question', questionSchema)