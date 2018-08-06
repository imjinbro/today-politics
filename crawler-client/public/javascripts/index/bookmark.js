function saveArchive(){
	if(document.getElementById('comment_input_name').value === ''){
		alert('로그인이 필요한 기능입니다');
		return ;
	}


	let id = document.getElementById('comment_conn_id').value;
	
	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/archive', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');	
	xhr.onreadystatechange = function(){
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			let result = JSON.parse(xhr.responseText);
			
			if(result.isSuccess){
				let msg;

				if(result.insertId < 1) {
					msg = '이미 북마크 설정되어있습니다';
				} else {
					msg = '북마크 설정되었습니다';
				}

				alert(msg);
	
			} else {
				console.log('fail');
			}
		}
	}

	xhr.send(`rank_id=${id}`);
}

document.getElementById('archive_btn').addEventListener('click', saveArchive);
