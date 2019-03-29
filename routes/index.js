var express = require('express');
var router = express.Router();
var application = require('../models/Application');
var test = require('../test/models');
var GPS = require('gps');

// Middleware to briefly test the models 
router.use(test);
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
