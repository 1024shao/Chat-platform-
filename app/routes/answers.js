const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/questions/:questionsID/answers' })
const { secret } = require('../config')
const {
  find, findById, create, update, remove, checkAnswerer,
  checkAnswerExit
} = require('../controllers/answers')

const auth = jwt({ secret })

router.get('/', find)

router.get('/:id', checkAnswerExit, findById)

router.post('/', auth, create)

router.patch('/:id', auth, checkAnswerExit, checkAnswerer, update)

router.delete('/:id', auth, checkAnswerExit, checkAnswerer, remove)

module.exports = router
