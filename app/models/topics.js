const mongoose = require('mongoose')
const { Schema, model } = mongoose

const topicSchema = new Schema({
  __v: { type: 'number', select: false },
  name: { type: 'string' },
  avatar_url: { type: 'string' },
  introduction: { type: 'string', select: false }
})


module.exports = model('Topic', topicSchema)