const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/topics' })
const { secret } = require('../config')
const {
  find, findById, create, update, checkExit
} = require('../controllers/topics')

const auth = jwt({ secret })

router.get('/', find)

router.get('/:id', checkExit, findById)

router.post('/', auth, create)

router.patch('/:id', auth, checkExit, update)


module.exports = router
