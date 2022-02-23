const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: { type: 'number', select: false },
  name: { type: "string", required: true },
  password: { type: "string", required: true, select: false },
  avatar_url: { type: 'string' }, // 头像
  gender: { type: 'string', enum: ['male', 'female'], default: 'male' },//性别
  headLine: { type: 'string' },//一句话简介
  locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false },//常住地
  business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },//行业
  employments: {
    type: [
      {
        company: { type: Schema.Types.ObjectId, ref: 'Topic' },
        job: { type: Schema.Types.ObjectId, ref: 'Topic' }
      }
    ],
    select: false
  }, //职业经历
  educations: {//教育经历
    type: [{
      school: { type: Schema.Types.ObjectId, ref: 'Topic' },
      major: { type: Schema.Types.ObjectId, ref: 'Topic' },
      diploma: { type: 'number', enum: [1, 2, 3, 4, 5] },
      entrance_year: { type: 'number' },
      graduation_year: { type: 'number' }

    }],
    select: false
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    select: false
  },
  followTopics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false
  }
})


module.exports = model('User', userSchema)