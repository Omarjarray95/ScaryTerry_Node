var express = require('express');
var router = express.Router();
var quiz_controller = require('../controllers/quiz.controller');

router.post("/", quiz_controller.add);

router.get('/', quiz_controller.getAll);

router.post('/validate', quiz_controller.validate);

module.exports = router;