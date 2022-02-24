const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/questions/:questionsID/answers/answerId' })
const { secret } = require('../config')
const {
  find, findById, create, update, remove, checkCommentExit,
  checkCommentator
} = require('../controllers/comments')

const auth = jwt({ secret })

router.get('/', find)

router.get('/:id', checkCommentExit, findById)

router.post('/', auth, create)

router.patch('/:id', auth, checkCommentExit, checkCommentator, update)

router.delete('/:id', auth, checkCommentExit, checkCommentator, remove)

module.exports = router
