const mysql = require("mysql");

/* 数据库配置 */
var pool = mysql.createPool({
    host:        'localhost',
    user:        'myroot',
    password:    'root',
    database:    'node',
});

var query = (sql,callback) => {
    pool.getConnection(function(err,conn){
        if(err) throw err;
        conn.query(sql,function(qerr,vals,fields){
            //释放连接
            conn.release();
            //事件驱动回调
            callback(qerr,vals,fields);
        });
    });
};

module.exports = query;