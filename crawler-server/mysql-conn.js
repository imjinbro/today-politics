const mysql = require('mysql');
const connection = mysql.createConnection({
	host: "politics-word.cw1byrlditrs.ap-northeast-2.rds.amazonaws.com",
	user: "root",
	password: "",
	port: 3306,
	database: "word"
});


module.exports = connection;
