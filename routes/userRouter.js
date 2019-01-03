const Router = require('koa-router');
const userControl = require('../controller/user.js');
const router = new Router({
	prefix: '/user'
})

router.post('/login', userControl.userLogin)
router.post('/register', userControl.userRegister)


module.exports = router;
