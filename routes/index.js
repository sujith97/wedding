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
