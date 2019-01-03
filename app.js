const Koa =  require('koa');
const app = new Koa();
const json = require('koa-json')
const cors = require('koa2-cors')
const router = require('./routes')
const logger = require('koa-logger')
const util = require('./util/util.js')
const onerror = require('koa-onerror')
const bodyparser = require('koa-body')

// error handler
onerror(app)

// cors
app.use(cors({
	origin (ctx) {
		return "*";
	}
}))

// middlewares
app.use(bodyparser({
	multipart: true,
    formidable: {
        maxFileSize: 800*1024*1024    // 设置上传文件大小最大限制，默认8M
    },
	enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
	const start = new Date()
	if(!util.checkSign(ctx))
		return ctx.body = {code: -1, msg: 'sign 错误'};
	await next()
	util.addResultCode(ctx);
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//router
app.use(router.routes(), router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  	console.error('server error', err, ctx)
});

module.exports = app
