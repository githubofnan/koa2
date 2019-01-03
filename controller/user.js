const util = require('../util/util.js')
const dateFormat = require('format-datetime')
const {queryUser, editUser} = require('../util/querySql.js')

const renderUserInfo = (res) => {
	var userInfo = res[0];
	const date = new Date();
	const now = dateFormat(date,"yyyy-MM-dd/HH:mm:ss");
	const str = userInfo.mobile +'-'+ now +'-'+ userInfo.password;
	const token = util.aesEncrypt(str);
	userInfo.token = token;
	delete userInfo.password;
	return userInfo;
}

module.exports = {
	async userLogin (ctx) {
		const param = ctx.request.body;
		const res = await queryUser('mobile', param.mobile);
		if(!res || res.length<1){
			return ctx.body = {code: '-1422'}
		}else if(res[0].password !== param.pwd){
			return ctx.body = {code: '-1423'};
		}else{
			return ctx.body = renderUserInfo(res)	
		}
	},
	async userRegister (ctx) {
		const param = ctx.request.body;
		const res = await queryUser('mobile', param.mobile);
		if(res[0]){
			return ctx.body = 'it is a user';
		}else{
			console.log(param)
			var register = await editUser(param);
			var userInfo = await queryUser('id', register.insertId);
			return ctx.body = renderUserInfo(userInfo)	
		}
	}
}