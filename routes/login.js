var express = require('express'),
	config = require('../config'),
	router = express.Router()
	Step = require('step'),
	FB = require('FB'),
  dbService = require('../services/dbService');

FB.options({
  appId:          process.env['FB_APP_ID'],
  appSecret:      process.env['FB_APP_SECRET'],
  redirectUri:    process.env['FB_REDIRECT_URL']
});

var facebook= require('../services/facebook')(FB);

router.get('/callback', function(req, res, next) {
  var code = req.query.code;
  if(req.query.error) {
    // user might have disallowed the app
    return res.send('login-error ' + req.query.error_description);
  } else if(!code) {
    return res.redirect('/');
  }

  Step (
    function exchangeCodeForAccessToken() {
      FB.napi('oauth/access_token', {
        client_id:      FB.options('appId'),
        client_secret:  FB.options('appSecret'),
        redirect_uri:   FB.options('redirectUri'),
        code:           code
      }, this);
    },
    function extendAccessToken(err, result) {
      if(err) throw(err);
      FB.napi('oauth/access_token', {
        client_id:          FB.options('appId'),
        client_secret:      FB.options('appSecret'),
        grant_type:         'fb_exchange_token',
        fb_exchange_token:  result.access_token
      }, this);
    },
    function (err, result) {
      if(err) return next(err);
      result.access_token;
      result.expires || 0;

      facebook('/me', result.access_token).then(function(data) {
        var person = {
          name: data.name,
          authToken: result.access_token,
          ttl: result.expires || 0
        }

        dbService.updateUserSession({ _id: data.id }, { upsert: true }, person).then(function() {
          res.cookie('ramana', data.id);
          res.cookie('gokula', result.access_token);
          return res.redirect('/');
        }, function(err) {
          console.error(err);
          return res.redirect('/');
        });
      });
    }
  );
});

function constructUser(data) {
  user = {
    _id: data.id,
    name: data.name,
  }
  return user;
}

module.exports = router;