const {getTwister} = require('../util/querySql.js')

module.exports = {
	async tongueTwister (ctx) {
		const res = await getTwister();
		const length = res.length;
		var random = parseInt(Math.random()*100000)%length;
		console.log(res[random])
		return ctx.body = res[random];
	}
}