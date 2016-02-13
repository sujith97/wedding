var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  needDb = process.env['mongodb'],
  mongoose = null,
  _MONGODB = {};

if (needDb === true) {
  mongoose = require('mongoose');
  _MONGODB.URL = process.env['mongodb_url'];
  _MONGODB.PWD = process.env['mongodb_pwd'];

  mongoose.connect(_MONGODB.URL); 
}

var routes = require('./routes/index');

var app = express();

if (app.get('env') === 'development') {
  console.log('DEVELOPMENT');
  // view files lookup.
  app.set('views', path.join(__dirname, 'views'));
  // Static file lookup.
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(logger('dev'));
} else {
  console.log('PRODUCTION');
  app.set('views', path.join(__dirname, 'release'));
  app.use(express.static(path.join(__dirname, 'release')));
}

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log('Error: ' + err.message);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
