const Router = require('koa-router');
const tencControl = require('../controller/tencent.js');
const router = new Router({
	prefix: '/tencent'
})

router.post('/faceage', tencControl.faceAge)
router.post('/facecosmetic', tencControl.faceCosmetic)
router.post('/facedecoration', tencControl.faceDecoration)

module.exports = router;
