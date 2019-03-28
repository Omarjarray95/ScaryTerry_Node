var express = require('express');
var router = express.Router();
var app_controller = require('../controllers/application.controller');
var app_middleware = require('../middlewares/application.middleware');

router.post('/add', app_middleware.add, app_controller.add);

router.get('/', app_controller.get);

router.get('/:id', app_controller.getOne);

router.get('/applier/:id', app_controller.getByApplier);


module.exports = router;