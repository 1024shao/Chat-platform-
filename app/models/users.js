const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: { type: 'number', select: false },
  name: { type: "string", required: true },
  password: { type: "string", required: true, select: false }
})


module.exports = model('User', userSchema)