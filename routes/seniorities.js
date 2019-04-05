var express = require('express');
var router = express.Router();
var seniority_controller = require('../controllers/seniority.controller');

//@Route: seniority/next/:id
router.get('/next/:id', seniority_controller.nextSeniority);

//@Route: seniority/add
router.post('/add', seniority_controller.addSeniority);

module.exports = router;