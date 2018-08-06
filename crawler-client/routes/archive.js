const express = require('express');
const router = express.Router();
const pool = require('./mysql-conn');


const fs = require('fs');

let params = {
	isLoginPage: false,
	isLogin: false
};

router.get('/', function(req, res, next){
	if(req.session.isLogin){
		params.isLogin = true;
		res.render('archive', params);
	} else {
		res.redirect('/');	
	}
});

router.get('/:id', function(req, res, next){
	let id = req.params.id;
	let resObj = {
		isSuccess: false,
		msg: ''
	};

	pool.getConnection(function(err, connection){
		if(err){
			return ;
		} 

		connection.query(`SELECT b.description, GROUP_CONCAT(c.name SEPARATOR "-") AS name, GROUP_CONCAT(c.content SEPARATOR "-") AS content FROM (SELECT * FROM best WHERE id=${id}) AS b LEFT JOIN (SELECT * FROM comment) AS c ON b.id = c.best_id;`, function(err, result, fields){
			if(err){
				resObj.msg = '리스트 가져오기를 실패하였습니다';
			} 

			if(result[0]) {
				resObj.isSuccess = true;
				resObj.result = result; 
			} else{
				resObj.msg = '';
			}

			res.json(resObj);
			connection.release();
		});
	});		
		

});

/* 아카이브 조회 */
router.post('/search', function(req, res, next){

	let user = req.session.uid;	
	let period = parseInt(req.body.period);
	let limit = parseInt(req.body.limit);


	let resObj = {
		isSuccess: false,
		msg: ''
	};


	let sql = `SELECT b.id, b.words, b.time FROM best b RIGHT JOIN (SELECT rank_id FROM archive WHERE user = "${user}" ) as a ON b.id = a.rank_id `; 
	let sql2;
	

	if(period > 0){
		sql2 = `WHERE b.time >= CURDATE()-${period} ORDER BY b.id DESC LIMIT ${limit};`;	
	} else {
		sql2 = `ORDER BY b.id DESC LIMIT ${limit};`;	
	}

	pool.getConnection(function(err, connection){
		if(err){
			return ;
		}

		connection.query(sql + sql2, function(err, result, fields){
			if(err){
				resObj.msg = '정보 가져오기에 실패했습니다';	
			} 

			if(result[0]){
				resObj.isSuccess = true;
				resObj.msg = '랭킹 단어칸을 클릭하면 그 날의 기록을 자세히 볼 수 있어요..!';	
				resObj.result = result; //JSON.parse
			} else {
				resObj.msg = '저장된 랭킹이 없습니다';
			}

			res.json(resObj);
			connection.release();
		});
	});
});


/* 아카이브 인덱스 페이지 기능 */
router.post('/', function(req, res, next){
	let user = req.session.uid;
	let rank_id = req.body.rank_id;

	let resObj = {
		isSuccess: false,
		msg: ''
	};

	pool.getConnection(function(err, connection){
		if(err){
			return ;
		}

		connection.query(`INSERT INTO archive (user, rank_id) SELECT "${user}", ${rank_id} FROM DUAL WHERE NOT EXISTS (SELECT * FROM archive WHERE user="${user}" AND rank_id=${rank_id})`, function(err, result, fields){
			if(err){
				resObj.msg = '랭킹 저장에 실패했습니다'
			} else {
				//result.insertId checking
				resObj.insertId = result.insertId; //test;
				resObj.isSuccess = true;	
			} 

			res.json(resObj);
			connection.release();
		});
	});	
});


router.delete('/:id', function(req, res, next){
	let user = req.session.uid;
	let rank_id = req.params.id;

	let resObj = {
		isSuccess: false,
		msg: ''
	};

	pool.getConnection(function(err, connection){
		if(err){
			return ;
		}

		connection.query(`DELETE FROM archive WHERE user="${user}" AND rank_id=${rank_id};`, function(err, result, fields){
			if(err || result.affectedRows < 1){
				resObj.msg = '삭제 실패했습니다';	
			} else {
				resObj.isSuccess = true;
			}
			
			res.json(resObj);
			connection.release();
		});
	});
});


module.exports = router;
