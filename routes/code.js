var express = require('express');
var router = express.Router();
var code_controller = require('../controllers/code.controller');


router.post('/', code_controller.add);

router.get('/', code_controller.get);

module.exports = router;