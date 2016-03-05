var express = require('express'),
	router = express.Router(),
	config = require('../config'),
	bootstrap = require('../services/bootstrap'),
	FB = require('fb'),
	dbService = require('../services/dbService');

FB.options({
  appId:          process.env['FB_APP_ID'],
  appSecret:      process.env['FB_APP_SECRET'],
  redirectUri:    process.env['FB_REDIRECT_URL']
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', prepareRespObj(req.cookies));
});

router.get('/termsprivacy', function(req, res, next) {
	res.send('All copyright, trade marks, design rights, patents and other intellectual property rights (registered and unregistered) in and on http://bheemireddi.com belong to myself (Sujith Bheemireddi). ');
});

router.get('/help', function(req, res, next) {
	res.send('Please email: "sujithterminal@gmail.com" for any help.');
});

function prepareRespObj(cookies) {
	var resp = {
		MODULE_NAME: config.INDEX_PAGE.MODULE_NAME,
		TITLE: config.INDEX_PAGE.TITLE,
		ID: null,
		AUTH_TOKEN: null
	}

	if (cookies.ramana) {
		resp.ID = cookies.ramana;
		resp.AUTH_TOKEN = cookies.gokula
	}
	return resp;
}

router.get('/dummy', function(req, res, next) {
  bootstrap.saveVenue();
  res.send('done');
});

module.exports = router;
