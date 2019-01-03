const crypto = require('crypto')
const request = require('request')
const Edit = require('../util/data.js')
const util = require('../util/util.js')
const face_age_url = 'https://api.ai.qq.com/fcgi-bin/ptu/ptu_faceage';
const face_cosmetic_url = 'https://api.ai.qq.com/fcgi-bin/ptu/ptu_facecosmetic';
const face_decoration_url = 'https://api.ai.qq.com/fcgi-bin/ptu/ptu_facedecoration';
const APP_INFO = {
	APP_ID: 	'1107127989',
	APP_KEY: 	'PAUGegEGybKthviF',
	NONCE_STR: 	'0859q9fUSya577CE',
}


const getAISign = (param)  => {
	let str = '';
	let app_key = APP_INFO.APP_KEY;
	let hash = crypto.createHash('md5');
	for(let key in param)
		str += key +'='+ encodeURIComponent(param[key]) +'&';
	str += 'app_key=' + app_key;
	let md5Str = hash.update(str).digest('hex');
	return md5Str.toLocaleUpperCase();
}

const requestAi = (url, edit) => {
	return new Promise((resolve, reject) => {
		edit.put('app_id', APP_INFO.APP_ID)
		edit.put('nonce_str', APP_INFO.NONCE_STR)
		edit.put('time_stamp', parseInt(new Date()/1000))
		let sortParam = util.objKeySort(edit.getAll());
		sortParam.sign = getAISign(sortParam);
		request.post({url: url,form: sortParam}, (err, res, body) => {
			resolve(res.body)
		})
	})
}

module.exports = {
	async faceDecoration (ctx) {
		const file = ctx.request.files.img;
		const type = ctx.request.body.type_noSign;
		const path = await util.saveFile(file, 'upload')
		let img = util.imgTobase64(path);
		let edit = new Edit();
		edit.put('image', img);
		edit.put('decoration', type);
		let res = await requestAi(face_decoration_url, edit)
		ctx.body = JSON.parse(res);
	},
	async faceCosmetic (ctx) {
		const file = ctx.request.files.img;
		const type = ctx.request.body.type_noSign;
		const path = await util.saveFile(file, 'upload')
		let img = util.imgTobase64(path);
		let edit = new Edit();
		edit.put('image', img);
		edit.put('cosmetic', type);
		let res = await requestAi(face_cosmetic_url, edit)
		ctx.body = JSON.parse(res);
	},
	async faceAge (ctx) {
		const file = ctx.request.files.img;
		const path = await util.saveFile(file, 'upload')
		let img = util.imgTobase64(path);
		let edit = new Edit();
		edit.put('image', img);
		let res = await requestAi(face_age_url, edit)
		ctx.body = JSON.parse(res);
	}

}