var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  mongoose = null;

if (process.env['DB_URL']) {
  mongoose = require('mongoose');
  var options = {
    server: { poolSize: 5 },
    user: process.env['DB_USER'],
    pass: process.env['DB_PASS']
  }
  mongoose.connect(process.env['DB_URL'], options);
}

var routes = require('./routes/index'),
  login = require('./routes/login');

var app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env['SERVER_ADDRESS']);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


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
app.use(cookieParser(process.env['COOKIE_SECRET']));

app.set('view engine', 'ejs');

app.use('/', routes);
app.use('/login', login);

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

process.on('SIGINT', function() {
  if (mongoose) {
    console.log("Caught interrupt signal. Disconnecting mongoose connection.");
    mongoose.disconnect(function() {
      process.exit();
    })
  } else {
    process.exit();
  }

});

module.exports = app;
