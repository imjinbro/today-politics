"use strict";

const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const moment = require('moment');


function crawler(){

    let promises = [];
	let siteInfo = [
		{ url: 'http://media.daum.net/breakingnews/politics?page=${pageNum}&regDate=${DATE}', tag: '.cont_thumb .tit_thumb .link_txt', charset: 'utf-8' },	
		{ url: 'http://news.nate.com/recent?cate=pol&mid=n0201&type=c&date=${DATE}&page=${pageNum}', tag: '.mduSubjectList .mlt01 .tit', charset: 'euc-kr' }
	];
	
	const LIMIT_PAGE_NUM = 5;
	const DATE = moment().format('YYYYMMDD');

	for(let i=0; i<siteInfo.length; i++){
		for(let pageNum=1; pageNum<LIMIT_PAGE_NUM; pageNum++){
			let p = new Promise(function(resolve, reject){
				request({
					uri: eval('`' + siteInfo[i].url + '`'),
					encoding: null
				}, function(err, res, body){
					let $ = cheerio.load(iconv.decode(body, siteInfo[i].charset));
					let result = $(siteInfo[i].tag).text();
			
					if(!result){
						result = '';
					}

					resolve(result);

				}); /* end request */
			});
			promises.push(p);
		}	/* end for(2) */
	} /* end for(1) */

    return promises;
}

module.exports = {
	crawler: crawler,
	time: moment
}
