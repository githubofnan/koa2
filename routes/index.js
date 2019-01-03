const Router = require('koa-router')
const userRouter = require('./userRouter.js')
const uniqRouter = require('./uniqueRouter.js')
const tencRouter = require('./tencentRouter.js')
const router = new Router({
	prefix: '/api'
})

/* user */
router.use(userRouter.routes(), userRouter.allowedMethods())
/* 腾讯AI */
router.use(tencRouter.routes(), tencRouter.allowedMethods())
/* 杂类 */
router.use(uniqRouter.routes(), uniqRouter.allowedMethods())


module.exports = router;