const express = require('express');
const router = express.Router();
const pool = require('./mysql-conn');

router.get('/', function(req, res, next){
	pool.getConnection(function(err, connection){
		if(err){
			return;
		}

		connection.query('SELECT r.*, GROUP_CONCAT(c.user SEPARATOR "-") AS comment_uid, GROUP_CONCAT(c.name SEPARATOR "-") AS comment_user, GROUP_CONCAT(c.content SEPARATOR "-") AS comment_content FROM (SELECT * FROM best ORDER BY id DESC LIMIT 1) AS r LEFT JOIN comment AS c ON r.id = c.best_id;', function(err, result, fields){
			if(err) throw err;

			let params;

			if(result){
				params = result[0];
			} else {
				params = {};
			}
			
			res.json(params);
			connection.release();
		});
	});
});

module.exports = router;
