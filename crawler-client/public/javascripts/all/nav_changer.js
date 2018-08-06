var urlArr = location.href.split('/');
var tail = urlArr[urlArr.length-1];

if(tail === '' || tail === '#comment_see'){
	tail = 'home';
} else if(tail == 'archive') {
	tail = 'archive';
}

var target = document.getElementById('nav_' + tail).classList; 
target.add('nav_clicked');                                   

