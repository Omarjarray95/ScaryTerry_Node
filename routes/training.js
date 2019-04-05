var express = require('express');
var router = express.Router();
var training_controller = require('../controllers/training.controller');

router.post('/event', training_controller.postEvent);

module.exports = router;