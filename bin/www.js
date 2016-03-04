#!/usr/bin/env node

/** Module dependencies. */
var app = require('../app'),
  debug = require('debug')('TestMe:server'),
  http = require('http'),
  dbService = require('../services/dbService'),
  FB = require('fb'),
  facebook= require('../services/facebook')(FB),
  q = require('q');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {//user_loggedin
  socket.on('name', function(req) {
    validate(req).then(function(userDetails) {
      if (userDetails.loggedIn) {
        socket.emit('person_name', userDetails.person.name);
      }
    });
  });
  
  socket.on('logout', function(req) {
    console.log('logging out')
    validate(req).then(function(userDetails) {
      if (userDetails.loggedIn) {
        dbService.updateUserSession({ _id: userDetails.person.id }, { upsert: false }, { 
          authToken: null,
          ttl: 0
        }).then(function(resp) {
          socket.emit('logged out');
        });
      }
    });
  });

  socket.on('event details', function(req) {
    var resp = {
      wedding: {},
      bridal: {},
      reception: {}
    };
    validate(req).then(function(userDetails) {
        dbService.getEventsContent(1).then(function(event) {
          var weddingVenue = getVenue(event.venue, 'wedding');
          if (userDetails.loggedIn && userDetails.person.hasWeddingInvitation) {
            resp.wedding = weddingVenue;
          } else {
            resp.wedding.content = weddingVenue.content;
          }

          var bridalVenue = getVenue(event.venue, 'bridal');
          if (userDetails.loggedIn && userDetails.person.hasBridalInvitation) {
            resp.bridal = bridalVenue;
          } else {
            resp.bridal.content = bridalVenue.content;
          }

          var bridalVenue = getVenue(event.venue, 'reception');
          if (userDetails.loggedIn && userDetails.person.hasReceptionInvitation) {
            resp.reception = bridalVenue;
          } else {
            resp.reception.content = bridalVenue.content;
          }

          socket.emit('event details resp', resp);
        });

    });
    
  });

  socket.on('fb_url', function() {
    socket.emit('fb_url_resp', FB.getLoginUrl({ scope: 'user_about_me' }));
  });
});

function getVenue(venues, type) {
  var venue = {};
  venues.forEach(function(loopedVenue) {
    if (loopedVenue._type === type) {
      venue = loopedVenue;
    }
  });
  return venue;
}

function validate(req) {
  var defer = q.defer();
  // FB.api('/debug_token/?input_token=' + req.token + '&access_token=' + FB.options('appId'), function(result) {
  //   console.log(result);
  // });
  if (req.id) {
    dbService.findUser(req.id).then(function(person) {
      defer.resolve({loggedIn: (person.id === req.id && person.token === req.token), person: person});
    });
  } else {
    setTimeout(function() {
      defer.resolve( { loggedIn: false });
    }, 1);
  }

  return defer.promise;
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
