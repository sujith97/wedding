var express = require('express');
var router = express.Router();
var config = require('../config'); // get our config file

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', config.INDEX_PAGE);
});

module.exports = router;
