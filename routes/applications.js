var express = require('express');
var router = express.Router();
var app_controller = require('../controllers/application.controller');
var app_middleware = require('../middlewares/application.middleware');

// app_middleware.add
router.post('/add/:email/:offer', app_controller.add);

router.get('/', app_controller.get);

router.get('/:id', app_controller.getOne);

router.get('/applier/:id', app_controller.getByApplier);


module.exports = router;