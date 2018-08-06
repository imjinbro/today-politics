const mysql = require('mysql');

const connection = mysql.createPool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWD,
	database: process.env.DB_NAME
});

module.exports = connection; 
