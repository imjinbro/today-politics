const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const pool = require('./mysql-conn');
const fs = require('fs');

let params = {
	isLoginPage: false,
	words: ''
 };

let day = {
	Monday: '월',
	Tuesday: '화',
	Wednesday: '수',
	Thursday: '목',
	Friday: '금',
	Saturday: '토',
	Sunday: '일'	
};

router.get('/', function(req, res, next) {

	if(req.session.isLogin){
		params.isLogin = true;
	} else {
		params.isLogin = false; 
	}

	let tz = moment.tz('Asia/Seoul');
	let day_str = tz.format('dddd');
	let time = parseInt(tz.format('H'));


	pool.getConnection(function(err, connection){
		if(err){
			return ;
		}

		connection.query('SELECT r.*, GROUP_CONCAT(c.user SEPARATOR "-") AS comment_uid, GROUP_CONCAT(c.id SEPARATOR "-") AS comment_id , GROUP_CONCAT(c.name SEPARATOR "-") AS comment_user, GROUP_CONCAT(c.content SEPARATOR "-") AS comment_content FROM (SELECT * FROM best ORDER BY id DESC LIMIT 1) AS r LEFT JOIN comment AS c ON r.id = c.best_id;', function(err, result, fields){
			if(err) {
				fs.appendFileSync('mysql-main-error.txt', err, 'utf-8');
				return ;
			}
	
			/* 랭킹 데이터 */
			if(!result[0]){
				params.words = '데이터 크롤링 중입니다';
			} else {
				let dataObj = result[0]; 
				params.words = dataObj.words.split(',');

				/* 랭킹 설명 */
				if(dataObj.description){
					parans.description = dataObj.description;
				} else {
					params.description = '입력 중입니다...! 잠시만 기다려주세요!'
				}

				/* 댓글 */
				if(dataObj.comment_user){
					params.isComment = true;
					params.comment_uid = dataObj.comment_uid.split('-');
					params.comment_id = dataObj.comment_id.split('-');
					params.comment_user = dataObj.comment_user.split('-');
					params.comment_content = dataObj.comment_content.split('-');
				} else {
					params.isComment = false;
				}

				/* 댓글폼 */
				params.rank_id = parseInt(dataObj.id);

				params.date = tz.format('YYYY.MM.DD');
				params.day = day[day_str];	

				if(time%2 > 0){
					params.time = time-1;
				} else {
					params.time = time;
				}
			}

			res.render('index', params);
			connection.release();
		});
	});	
});

module.exports = router;
