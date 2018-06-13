const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express.Router();

const registerWorker = require('./registerWorker');

// registerWorker('logs', require('./workers/collate'));

const bindQueues = require('./bindQueues');


bindQueues('pp_logs', 'http:connect ws:close ws:connect ws:data ws:drain ws:end ws:error ws:lookup ws:timeout'.split(' '), ['logs'], () => {
	// uncomment after placing your favicon in /public
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());

	app.use('/', index);
	app.use('/users', users);

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  const err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});

	/*// error handler
	app.use(function(err, req, res, next) {
	  // set locals, only providing error in development
	  res.locals.message = err.message;
	  res.locals.error = req.app.get('env') === 'development' ? err : {};

	  // render the error page
	  res.status(err.status || 500);
	  res.render('error');
	});*/

});

module.exports = app;
