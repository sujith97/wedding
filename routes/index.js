var express = require('express'),
	router = express.Router(),
	config = require('../config'),
	bootstrap = require('../services/bootstrap'),
	FB = require('fb'),
	dbService = require('../services/dbService'),
	resourceDbService = require('../services/resourceDbService');

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

router.post('/liquor', function(req, res, next) {
	console.log(req.body)
	resourceDbService.saveLiquor(req.body).then(function(response) {
		res.end('OK');
	}, function(err) {
		res.json({err: err});
	});
});

router.get('/liquor/:id', function(req, res, next) {
	console.log(req.params.id)
	resourceDbService.findLiquor(req.params.id).then(function(response) {
		res.json(response);
	}, function(err) {
		res.json({err: err});
	});
});

router.post('/steward', function(req, res, next) {
	resourceDbService.saveSteward(req.body).then(function(response) {
		res.end('OK');
	});
});

router.get('/steward/:id', function(req, res, next) {
	resourceDbService.findSteward(req.params.id.toString()).then(function(response) {
		res.json(response);
	}, function(err) {
		res.json({err: err});
	});
});

router.post('/associate', function(req, res, next) {
	resourceDbService.associate(req.body).then(function(response) {
		res.json(response);
	}, function(err) {
		res.json({err: err});
	});
});

router.get('/associations', function(req, res, next) {
	resourceDbService.findAllAssociations().then(function(response) {
		res.json(response);
	}, function(err) {
		res.json({err: err});
	});
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
