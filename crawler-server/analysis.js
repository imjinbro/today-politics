"use strict";

const crawl = require('./crawler');
const mecab = require('mecab-ya');
const freq = require('freq');

const connection = require('./mysql-conn');
const fs = require('fs');

let date = crawl.time();

Promise.all(crawl.crawler()).then(function(data){
	if(!data){
		return ;
	}

	/************** mecab-analysis **************/
    mecab.nouns(data.toString(), function(err, result){
		if(err || !result){
			return ;
		}

		let freqWord = freq(result);
		let idx = 0;
		let filterWord = [
			'포토','기자','경향', '조선',
			'오늘', '내일', '어제', '모레', 
			'의원', '조사', '국민','국내', 
			'시간', '영상','참석', '생각', 
			'논의', '지역', '회의', '사진',
			'위원', '위원장', '무대', '미딩',
			'정당', '한국', '속보', '대표',
			'원내대표', '발언', '정치', '완료',
			'작업', '대표', '발언', '타임',
			'종합', '출범', '우상', '국당',
			'발표', '무계획', '니트', '여행',
			'헤드', '헤드라인', '제닝스', '지상',
			'방문', '부대', '장관', '형사',
			'혁신', '자유', '대책', '수사',
			'상보', '1보', '2보', '방법',
			'의혹', '복귀', '도착', '출발',
			'열일', '상징', '사건', '매스',
			'계획', '취재진', '응시', '출마',
			'요청', '수용', '지지', '선언',
			'개최', '브리핑', '부장', '이유',
			'응답', '리용', '용호', '환영',
			'만류', '긴급', '찬성', '반대'
		];
		let resWord = [];
		
		while(resWord.length<10){
			let target = freqWord[idx].word;
			let isFail = false;
			idx += 1;
			if(target.length < 2) continue;
		
			for(let i=0; i<filterWord.length; i++){
				if(filterWord[i] === target) {
					isFail = true;
					break;
				}
			}	

			if(isFail) continue;

			resWord.push(target);
		}

		/********* mysql-insert ***********/
		connection.connect();
		connection.query('INSERT INTO best (words, time) VALUES ("' + resWord.toString() + '", "' + date.format('YYYY-MM-DD') + '")', function(err, result, fields){
			if(err) {
				fs.appendFileSync('./log/mysql-error.txt', '============ error : ' + date + ' ============ \n '  + err + '========================== \n', 'utf-8');
				return ;
			}

			connection.end();
		});	
		

    }); /* end mecab analysis callback function */
	/* end promise then */
 }).catch(function(err){
	  fs.appendFile('/home/jinbro/crawler/log/error.txt', ` ==== oops! err ${crawl.time()} : ${err} ===== `, function(err){
	  	if(err) return ; 
	  });

	return ;
});

