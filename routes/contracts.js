var express = require('express');
var router = express.Router();
var contract_controller = require('../controllers/contract.controller');
var contract_middleware = require('../middlewares/contract.middleware');


//@Route : contracts?employee=
router.get('/', contract_controller.getCurrentContract);

//@Route: contracts/:id 
router.get('/:id', contract_controller.get);

//@Route: contracts/isFired/:id
router.get('/isfired/:id', contract_controller.isFired);

//@Route: contracts/fire/:id
router.get('/fire/:id', contract_controller.fire);

//@Route: contracts/prolonge/:id
router.get('/prolonge/:id', contract_controller.prolongation);

//@Route: contracts/hire/:id
router.post('/hire/:id', contract_middleware.isHired, contract_controller.hire);

module.exports = router;