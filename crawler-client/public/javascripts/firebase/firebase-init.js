let config = {
    apiKey: "AIzaSyAA5463Gu9ggMAEVuDQwrTB-vDrLsZSiC4",
    authDomain: "politics-hot-keyword.firebaseapp.com"
};


/******* check signIn - Out *******/
function checkSign(){
	if(document.getElementById('nav_signin')){
		localStorage.clear();
	}
}


/******* listener signIn - Out *******/
function listenSign(){
	firebase.auth().onAuthStateChanged(function(user){
		if(user){
			let loca = location.href.split('/');
			if(loca[loca.length-1] === ''){
				document.getElementById('comment_input_img').setAttribute('src', user.photoURL);
				document.getElementById('comment_input_img').innerText = user.email;
				document.getElementById('comment_input_name').value = user.displayName;
			}
			
			document.getElementById('nav_archive').setAttribute('href', '/archive');		
		
		} else {
			document.getElementById('nav_archive').removeAttribute('href');
			document.getElementById('nav_archive').style.cursor = 'pointer';
			document.getElementById('nav_archive').addEventListener('click', function(){
				alert('로그인이 필요한 메뉴입니다');
			});
		}
	});
}

/******** function signIn **********/
function signIn() {

	if (!firebase.auth().currentUser) {
		var provider = new firebase.auth.FacebookAuthProvider();
		
		
        provider.addScope('email');
		provider.addScope('public_profile');


        provider.setCustomParameters({
			'display': 'popup'
		});
        
		firebase.auth().signInWithPopup(provider).then(function(result) {
			let xhr = new XMLHttpRequest();
			xhr.open('POST', '/user/signin', true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.onreadystatechange = function() {
				if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
					location.href = '/';
				}
			}

			xhr.send(`uid=${result.user.email}`);

		})
		.catch(function(error) {
			var errorCode = error.code;
          	var errorMessage = error.message;
          	var email = error.email;
          	var credential = error.credential;
         
			if (errorCode === 'auth/account-exists-with-different-credential') {
				alert('이미 가입되어진 이메일 주소입니다.');
			} else {
				console.error(error);
			}
		});
	} else {
		alert('이미 로그인되어있습니다');
		location.href = '/';
	}
}

/********** function signOut ************/
function signOut(){
	let xhr = new XMLHttpRequest();
	xhr.open('GET', '/user/signout', true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
	
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			firebase.auth().signOut();
			location.href = '/';
		} 
	}	

	xhr.send();
}



firebase.initializeApp(config);
listenSign();
checkSign();
