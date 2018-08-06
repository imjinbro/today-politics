const express = require('express');
const router = express.Router();
const pool = require('./mysql-conn');

router.get('/', function(req, res, next){
	pool.getConnection(function(err, connection){
		if(err){
			return;
		}

		connection.query('SELECT * FROM best order by id desc limit 1', function(err, result, fields){
			if(err) throw err;

			let params;

			if(!result){
				params = {};
			} else {
				params = result[0];
			}
			
			res.json(params);
			connection.release();
		});
	});
});

module.exports = router;
