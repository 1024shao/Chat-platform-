const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/questions' })
const { secret } = require('../config')
const {
  find, findById, create, update, remove, checkQuestionExit,
  checkQuestioner
} = require('../controllers/questions')

const auth = jwt({ secret })

router.get('/', find)

router.get('/:id', checkQuestionExit, findById)

router.post('/', auth, create)

router.patch('/:id', auth, checkQuestionExit, checkQuestioner, update)

router.delete('/:id', auth, checkQuestionExit, checkQuestioner, remove)

module.exports = router
