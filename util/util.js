const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const errCode = {
	'-1422': '用户不存在',
	'-1423': '用户名与密码不匹配',
}

module.exports = {
	/* sign验证 */
	checkSign (ctx) {
		const data = ctx.request.body;
		let total = ctx.url.split('?');
		const key = 'H7843HOIDSHF9I23897V';
		let param = this.getUrlParam(ctx.url);
		let str = total[0]+'-'+key+'-'+param['t']+'?';
		if(Object.keys(data).length>0){
			let keySort = Object.keys(data).sort();
			for(let k in keySort){
				if(keySort[k].includes('_noSign')) continue;
				str += data[keySort[k]];
			}
		}
		let hash = crypto.createHash('md5');
		let sign = hash.update(str).digest('hex');
		if(sign.toLocaleUpperCase()!==param['sign']){
			return false;
		}
		return true;
	},
	/* 获取url参数 */
	getUrlParam (url) {
		let param = {};
		if(!url.includes('?')) return '';
		let pArr = (url.split('?'))[1].split('&');
		for(let k in pArr){
			let item = pArr[k].split('=');
			param[item[0]] = item[1]
		}
		return param;
	},
	/* 补全code */
	addResultCode (ctx) {
		if(ctx.response.status == 404){
			ctx.body = {code: 404,msg: 'Not Found'}
		}else{
			let res = {code: 0,msg: 'success'}
			if(typeof(ctx.body)=='object' && ctx.body.code && ctx.body.code<0){
				res.code = parseInt(ctx.body.code)
				res['msg'] = errCode[ctx.body.code]
			}else{
				res['result'] = ctx.body;
			}
			ctx.body = res;
		}
	},
	/* token 编码解码 */
	aesEncrypt (encrypt) {
		const encryptKey = 'THIS_IS_MINE';
		const cipher = crypto.createCipher('aes192', encryptKey);
		var crypted = cipher.update(encrypt, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	},
	aesDecrypt (encrypt) {
		const encryptKey = 'THIS_IS_MINE';
		const decipher = crypto.createDecipher('aes192', encryptKey);
		var decrypted = decipher.update(encrypt, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	},
	/* 上传储存文件 返回本地路径 file: 文件对象, fp: 文件储存文件夹 */
	saveFile (file, fp) {
		return new Promise((resolve, reject) => {
			const reader = fs.createReadStream(file.path);
			let filePath = path.join(__dirname, `../public/${fp}/`) + `${file.name}`;
			const upStream = fs.createWriteStream(filePath)
			let stream = reader.pipe(upStream);
			stream.on('finish', ()=> {
				resolve(filePath)
			})
		})
	},
	/* 本地img文件转base64 */
	imgTobase64 (filePath, type) {
		if(filePath.indexOf('\\') > 0)
			filePath = filePath.replace(/\\/g, '/');
		let data = fs.readFileSync(filePath);
		let base = Buffer.from(data, 'binary').toString('base64')
		// base = "data:" + type + ";base64," + base;
		return base;
	},
	/* obj按key排序 */
	objKeySort (arys) {
		let newObj = {};
		let keys = Object.keys(arys).sort();
		for(let i in keys)
			newObj[keys[i]] = arys[keys[i]];
		return newObj;
	}
}