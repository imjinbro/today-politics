var subdomain = require('express-subdomain');
var session = require('express-session');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index'); /* index Router */
var user = require('./routes/user');
var data = require('./routes/data');

//var logger = require('morgan');
//var dev = require('./routes/dev/main');
var comment = require('./routes/comment');
var archive = require('./routes/archive');
var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'keyboard cat',
	resave: false,
  	saveUninitialized: true,
	cookie: {
		secure: false
	}
}));

//app.use(subdomain('dev', dev));
app.use('/', index); 
app.use('/user', user); 
app.use('/data.json', data);
app.use('/comment', comment);
app.use('/archive', archive);
//app.use(logger('dev'));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
