const express = require('express');
const router = express.Router();
const pool = require('./mysql-conn');

const fs = require('fs');


router.post('/:id/edit', function(req, res, next){
	let resObj = {
		isExist: false
	};

	let uid = req.body.uid;
	let id = req.params.id;
	
	pool.getConnection(function(err, connection){
		if(err){
			return ;
		}

		connection.query('SELECT * FROM comment WHERE id=' + id +' AND user="' + uid + '";', function(err, result, fields){
			if(err){
				return ;
			} else {
				if(result[0]){
					resObj.isExist = true;
				}
				res.json(resObj);
				connection.release();
			}

		});
	});
});


router.post('/', function(req, res, next){
	let resObj = {
		isSuccess: false,
		msg: '' 
	};

	let uid = req.body.uid;
	let id = req.body.id;
	let name = req.body.name;
	let content = req.body.content;

	pool.getConnection(function(err, connection){
		if(err){
			fs.appendFileSync('mysql-ajax-error.txt', err, 'utf-8');
			return ;
		}
	
		connection.query('INSERT INTO comment (best_id, user, name, content) VALUES ("' + id + '", "' + uid + '", "' +  name  + '", "' +  content+ '")' , function(err, result, fields){
			 if(err){
				resObj.msg = '댓글 작성에 실패하였습니다.';
			} else{
				resObj.isSuccess = true;
				resObj.comment_id = result.insertId;
			}

			res.json(resObj);
			connection.release();
		});
	});
});


router.put('/:id', function(req, res,next){
	let uid = req.body.uid;
	let id = req.params.id;
	let content = req.body.content;
	let resObj = {
		isSuccess: false
	};

	pool.getConnection(function(err, connection){
		if(err){
			/* 잘못된 처리는 res.status로 처리할 것 : 가서 바꿉시다 */
			return;
		}

		connection.query('UPDATE comment SET content ="' + content + '"WHERE user="' + uid +'" AND id =' + id + ';', function(err, result, fields){
			if(err){
				
			} else {	
				resObj.isSuccess = true;
			}

			res.json(resObj);
			connection.release();
		});
	});
});


router.delete('/:id', function(req, res, next){
	let uid = req.body.uid;
	let id = req.params.id;
	let resObj = {
		isSuccess: false,
		msg: ''
	};

	pool.getConnection(function(err, connection){
		if(err){
			return ;
		}

		connection.query('DELETE FROM comment WHERE user="' + uid + '" AND id =' + id + ';', function(err, result, fields){
			if(err || result.affectedRows < 1){
				resObj.msg = '댓글을 삭제할 수 없습니다';
			} else {
				resObj.isSuccess = true;
			}

			res.json(resObj);
			connection.release();
		});
	});
});
/* 되는 것 확인한 후 하나의 함수로 줄이기 */

module.exports = router;
