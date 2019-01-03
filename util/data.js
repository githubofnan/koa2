/* 数据集合操作 */
module.exports = function Edit() {
	this.data = {},
	this.put = (key, value) => {
		if(!key) return false;
		this.data[key] = value;
	}
	this.get = (key) => {
		if(!key) return false;
		return this.data[key];
	},
	this.remove = (key) => {
		if(!key) return false;
		delete this.data[key];
	},
	this.getAll = () => {
		return this.data;
		
	}
}