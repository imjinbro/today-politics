/************** Time-diff ******************/
function diff(current, interval){
    let time_diff = {
        hour: 0,
        minute: 0
    };
	let standard_date = new Date(); 	
	let standard_hour = (parseInt(current.getHours()/interval) + 1) * interval;
	
	standard_date.setHours(standard_hour, 0);

	let gap = (standard_date.getTime() - current.getTime())/60000;

	time_diff.hour = parseInt(gap/60);
    time_diff.minute = parseInt(gap%60);

	
	if(time_diff.hour === 2){
		getJSONData(current);	
	}


	let percent = parseInt((120-gap)/120*100);

	/* 코드 수정하기 : 시간 수정하는 것 - 1분 차이 getTime으로 표현할 때 어떻게 나는지 보고 그 표현 차이에 따라 시간 수정하도록 */
	document.getElementById('content_timer_gage').style.width = percent + "%";
	document.getElementById('timer_percent').innerHTML = percent;
	document.getElementById('timer_hour').innerHTML = time_diff.hour;
	document.getElementById('timer_minute').innerHTML = time_diff.minute;
}



/* 코드 수정하기 : 최초 1회한 뒤에 인터벌 동작하도록 - 조금 더 간결하게 안되나?? */
window.onload = function(){
	diff(new Date(), 2); 
}

setInterval(function(){ diff(new Date(), 2) }, 5000);



/************* XMLHttpRequest ******************/
function getJSONData(current){
	let httpRequest;

	let time = current.toLocaleString('japanese').split(' ');
	let day = {
		0: '일',
		1: '월',
		2: '화',
		3: '수',
		4: '목',
		5: '금',
		6: '토'
	};

	let params = {
		date: time[0] + time[1] + time[2],
		day: day[current.getDay()],
		hour: current.getHours()
	};


	if(window.XMLHttpRequest){
		httpRequest = new XMLHttpRequest();
	}

	httpRequest.onreadystatechange = function(){
		if(httpRequest.readyState === 4){
			if(httpRequest.status === 200){
				document.getElementById('rank_date_date').innerHTML = params.date;
				document.getElementById('rank_date_day').innerHTML = params.day;
				document.getElementById('rank_date_time').innerHTML = params.hour;
				
				let dataObj = JSON.parse(httpRequest.responseText);
				let words = dataObj.words.split(',');
				//comment_user, comment_content

				for(let i=0; i<words.length; i++){
					document.getElementById('rank_word_'+i).innerHTML = words[i];
				}
			}
		}
	}

	httpRequest.open('GET', '/data.json', true);
	httpRequest.send();
}
