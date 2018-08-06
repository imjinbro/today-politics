/******** comment input ajax *********/
function InputComment(event){
	if(event.keyCode === 13) {	
		let name = document.getElementById('comment_input_name').value;
		if(!name){
			alert('댓글 작성은 로그인을 하셔야합니다');
			return ;
		}
		
		let content = document.getElementById('comment_input_content').value;
		if(!content || content === ' '){
			alert('댓글 내용을 입력해주세요');
			return ;
		}  
	
		let id = document.getElementById('comment_conn_id').value;
		let uid = document.getElementById('comment_input_img').textContent;

		let httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function(){
			if(httpRequest.readyState === 4){
				if(httpRequest.status === 200){
					let result = JSON.parse(httpRequest.responseText);

					if(result.isSuccess){
						document.getElementById('comment_input_content').value = '';

						let nameDom = document.createElement('p');
						nameDom.setAttribute('id', 'comment_name');
						nameDom.innerHTML = name; 


						/*********** comment-content ***********/
						let contentDom = document.createElement('div');
						contentDom.setAttribute('class', 'comment_content_pannel');
						
						let content_pos = document.createElement('p');
						content_pos.setAttribute('id', 'comment_content_' + result.comment_id);
						content_pos.setAttribute('class', 'comment_content');		
						content_pos.innerHTML = content;
	
						let content_modify = document.createElement('div');
						content_modify.setAttribute('id', 'comment_modify_pannel_' + result.comment_id);
						content_modify.setAttribute('class', 'comment_modify_pannel');
						content_modify.setAttribute('style', 'display: none;');

						let content_modify_input = document.createElement('input');
						content_modify_input.setAttribute('id', 'comment_modify_content_' + result.comment_id);
						content_modify_input.setAttribute('class', 'comment_modify_input');
						content_modify_input.setAttribute('type', 'text');
						content_modify_input.value = content; 
			
						content_modify.appendChild(content_modify_input);
						contentDom.appendChild(content_pos);
						contentDom.appendChild(content_modify);
	
						 
						/*********** comment-ctl ************/
						let comment_ctl_pannel = document.createElement('div');
						comment_ctl_pannel.setAttribute('id', 'comment_set_pannel');

						let modify_btn_pannel = document.createElement('div');
						let delete_btn_pannel = document.createElement('div');
						
						modify_btn_pannel.setAttribute('id', 'comment_delete_'+result.comment_id);
						modify_btn_pannel.setAttribute('class', 'comment_ctl_btn');

						let modify_toggle = document.createElement('i');
						modify_toggle.setAttribute('class', 'fa fa-cog');
						modify_toggle.setAttribute('id', 'comment_modify_' + result.comment_id);
						modify_toggle.addEventListener('click', function(e){
						    ModifyToggle(e.target);
						});
						modify_btn_pannel.appendChild(modify_toggle);


						
						delete_btn_pannel.setAttribute('id', 'comment_delete_'+result.comment_id);
						delete_btn_pannel.setAttribute('class', 'comment_ctl_btn');

						let delete_btn = document.createElement('i');
						delete_btn.setAttribute('class', 'fa fa-times');
						delete_btn.setAttribute('id', 'comment_delete_' + result.comment_id);
						delete_btn.addEventListener('click', function(e){
							DeleteComment(e.target);
						});
						delete_btn_pannel.appendChild(delete_btn);
					
						comment_ctl_pannel.appendChild(modify_btn_pannel);
						comment_ctl_pannel.appendChild(delete_btn_pannel);
						
	
						let parentNode = document.createElement('div');
						parentNode.setAttribute('id', 'comment_' + result.comment_id);
						parentNode.setAttribute('class', 'comment');
						parentNode.appendChild(nameDom);
						parentNode.appendChild(contentDom);
						parentNode.appendChild(comment_ctl_pannel);
						document.getElementsByClassName('comment_dp_area')[0].appendChild(parentNode);


						location.href='#comment_see';

					} else {
						alert('댓글 작성에 실패하였습니다.');
					}
				}
			}	 
		};

		httpRequest.open('POST', '/comment', true);
		httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		httpRequest.send(`uid=${uid}&id=${id}&name=${name}&content=${content}`);
	}
}


/********** comment update ajax *****************/
function ModifyToggle(e){
	let targetId = e.getAttribute('id');
	let targetArr = targetId.split('_');
	let id = targetArr[targetArr.length-1];

	let uid = document.getElementById('comment_input_img').textContent;
	let target = document.getElementById('comment_modify_pannel_' + id);
	
	if(target.style.display === 'none'){
		if(uid){
			let httpRequest = new XMLHttpRequest();
			httpRequest.onreadystatechange = function(){
				if(httpRequest.readyState === 4){
					if(httpRequest.status === 200){
						let result = JSON.parse(httpRequest.responseText);
						/* 결과에 따라서 처리 : JSON 받아서 isBe - true일 경우(있을 경우) 열어줌 */
						if(result.isExist){
							target.style.display = 'flex';
							document.getElementById('comment_modify_content_' + id).addEventListener('keydown', function(e){
								if(e.keyCode === 13){
									UpdateComment(id);
								}
							});
						} else {
							alert('댓글 수정 권한이 없습니다');
						}
					}
				}
			}

			httpRequest.open('POST', '/comment/' + id + '/edit', true);
			httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');  
			httpRequest.send(`uid=${uid}`);	

		} else {
			alert('댓글 수정 권한이 없습니다');
		}

	/* style.display === 'flex' */
	} else {
		target.style.display = 'none';
	}

}


function UpdateComment(targetId){
	let uid = document.getElementById('comment_input_img').textContent;
	
	if(uid){
		let id = targetId;
		let target = document.getElementById('comment_modify_content_' + id);
		
    	let httpRequest = new XMLHttpRequest(); 
		httpRequest.onreadystatechange = function(){
			if(httpRequest.readyState === 4){
				if(httpRequest.status === 200){
					let result = JSON.parse(httpRequest.responseText);	
					if(result.isSuccess){
						document.getElementById('comment_content_' + id).innerHTML = target.value; 	
						document.getElementById('comment_modify_pannel_' + id).style.display = 'none';
					} else {
						alert('댓글 수정에 실패하였습니다');
					}
				}
			} 
		};

		if(target.value === ''){
			alert('최소 1글자 이상 입력해야합니다');
		} else {
			httpRequest.open('PUT', '/comment/' + id, true);
			httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			httpRequest.send(`uid=${uid}&content=${target.value}`);	
		}
		
	} else {
		alert('댓글 변경 권한이 없습니다');
	}
}


/********** comment delete ajax ****************/
function DeleteComment(e){
	let uid = document.getElementById('comment_input_img').textContent;
	
	if(uid){
		let targetId = e.getAttribute('id');
		let targetArr = targetId.split('_');	
		let id = targetArr[targetArr.length-1];

    	let httpRequest = new XMLHttpRequest(); 
		httpRequest.onreadystatechange = function(){
			if(httpRequest.readyState === 4){
				if(httpRequest.status === 200){
					let result = JSON.parse(httpRequest.responseText);		
					
					if(result.isSuccess){
						let target = document.getElementById('comment_' + id);
						document.getElementsByClassName('comment_dp_area')[0].removeChild(target);
					} else{
						alert(result.msg);
					}
				}
			}	 
		};

		/* user id값 전달해서 컨트롤러에서 검증하도록하기 */
		httpRequest.open('DELETE', '/comment/' + id, true);
		httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');	
		httpRequest.send(`uid=${uid}`);	
	} else {
		alert('댓글 삭제 권한이 없습니다');
	}
}

