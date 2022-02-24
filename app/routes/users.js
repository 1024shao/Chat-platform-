const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/users' })
const { find, del, create, updated,
  findById, login, checkOwner, listFollowing,
  listFollowers, checkUserExit, follow, unfollow,
  followTopic, unfollowTopic, listFollowTopics,
  listDisLikingAnswers, listLikingAnswers,
  likeAnswer, unlikeAnswer, disLikeAnswer, unDisLikeAnswer,
  collectAnswer, unCollectAnswer, listCollectionAnswers
} = require('../controllers/users')
const { checkExit } = require('../controllers/topics')
const { checkAnswerExit } = require('../controllers/answers')
const { secret } = require('../config')

//定义认证中间件
const auth = jwt({ secret })
// const auth = (async (ctx, next) => {
//   const { authorization = '' } = ctx.request.header // 赋初始值做短路处理
//   const token = authorization.replace('Bearer ', '')
//   try {
//     const user = jwt.verify(token, secret)
//     ctx.state.user = user // 存储用户信息
//   } catch (error) {
//     ctx.throw(401, error.message)
//   }
//   await next()
// })


router.get('/', find)

router.get('/:id', findById)

router.post('/', create)

router.delete('/:id', auth, checkOwner, del)

router.patch('/:id', auth, checkOwner, updated)

router.post('/login', login)

router.get('/:id/following', checkUserExit, listFollowing)

router.get('/:id/followers', checkUserExit, listFollowers)

router.put('/following/:id', auth, checkUserExit, follow)

router.delete('/following/:id', auth, checkUserExit, unfollow)

// 关注取消关注话题
router.put('/followTopic/:id', auth, checkExit, followTopic)
router.delete('/followTopic/:id', auth, checkExit, unfollowTopic)
//用户关注话题列表
router.get('/:id/followTopic', checkExit, listFollowTopics)

// 点赞 模块
router.get('/:id/likeAnswers', checkUserExit, listLikingAnswers)
router.put('/likeAnswers/:id', auth, checkUserExit, likeAnswer, unDisLikeAnswer)
router.delete('/likeAnswers/:id', auth, checkUserExit, unlikeAnswer)
// 踩 模块
router.put('/dislikeAnswers/:id', auth, checkUserExit, disLikeAnswer, unlikeAnswer)
router.delete('/dislikeAnswers/:id', auth, checkUserExit, unDisLikeAnswer)

// 收藏答案模块
router.get('/:id/collectingAnswers', checkUserExit, listCollectionAnswers)
router.put('/collectingAnswers/:id', auth, checkUserExit, collectAnswer)
router.delete('/collectingAnswers/:id', auth, checkUserExit, unCollectAnswer)
module.exports = router
