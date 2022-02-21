const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const { find, del, create } = require('../controllers/users')


router.get('/', find)

router.post('/', create)

router.delete('/', del)

module.exports = router
