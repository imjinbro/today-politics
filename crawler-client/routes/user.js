const express = require('express');
const router = express.Router();

router.get('/signin', function(req, res, next){
	let params = {
		isLoginPage: true,
		isLogin: false
	};

	if(req.session.isLogin){
		params.isLogin = true;
	}

	res.render('signin', params);
});

router.post('/signin', function(req, res, next){
	if(!req.session.isLogin && req.body.uid){
		req.session.isLogin = true;
		req.session.uid = req.body.uid;

		res.sendStatus(200);
	} else {
		res.sendStatus(500);
	}

});

router.get('/signout', function(req, res, next){
	req.session.destroy();
	res.sendStatus(200);
});

module.exports = router;
