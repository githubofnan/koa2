const queryData = require('./mysql.js');

/* 查询用户信息  user_info */
const queryUser = (key, value) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM user_info WHERE ${key}=${value}`;
		console.log(sql)
		try{
			queryData(sql, (qerr,vals,fields) => {
				resolve(vals);
			})
		}catch(err){
			throw err;
			reject(err);
		}
	})
}

/* 编辑用户信息  user_info */
const editUser = (param, userId='') => {
	if(userId){	/* edit */
		var str = '';
		for(let k in param)
			str += k +'="'+ param[k] +'",';
		str = str.slice(0, str.length-1);
		var sql = `UPDATE user_info SET ${str} WHERE id=${userId}`;
	}else{	/* add */
		var keys = '', values = '';
		for(let k in param){
			keys += k+',';
			values += '"'+ param[k] +'",';
		}
		keys = keys.slice(0, keys.length-1)
		values = values.slice(0, values.length-1)
		var sql = `INSERT INTO user_info (${keys}) VALUES (${values})`;
	}
	console.log(sql)
	return new Promise((resolve, reject) => {
		try{
			queryData(sql, (qerr,vals,fields) => {
				resolve(vals);
			})
		}catch(err){
			throw err;
			reject(err)
		}
	})
}

/* 查询绕口令 tongue_twister */
const getTwister = () => {
	var sql = `SELECT * FROM tongue_twister`;
	return new Promise((resolve, reject) => {
		try{
			queryData(sql, (qerr,vals,fields) => {
				resolve(vals);
			})
		}catch(err){
			throw err;
			reject(err)
		}
	})
}

module.exports = {
	queryUser,
	editUser,
	getTwister,
}