const Router = require('koa-router');
const unique = require('../controller/unique.js');
const router = new Router({
	prefix: '/unique'
})

router.post('/tongueTwister', unique.tongueTwister)

module.exports = router;