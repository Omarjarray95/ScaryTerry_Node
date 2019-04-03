var express = require('express');
var router = express.Router();
var contract_controller = require('../controllers/contract.controller');
var contract_middleware = require('../middlewares/contract.middleware');


//@Route : contracts?employee=
router.get('/', contract_controller.getCurrentContract);

//DONE: properly test this function 
//@Route: contracts/nbfires?employee=&from=&to=&fired=
router.get('/advanced', contract_controller.advancedContracts);

//@Route: contracts/nbfires?employee=&from=&to=&fired=
router.get('/advanced/count', contract_controller.advancedContractsCount);

//@Route : contracts/promotion/average?employee=
//TODO: add dates from and to for this route
router.get('/promotion/average/', contract_controller.avgPromotion);

//@Route: contracts/promote/:id
router.get('/promote/:id', contract_controller.promote);

//@Route: contracts/all?employee=
router.get('/all', contract_controller.allContractByEmployee);

//@Route: contracts/:id 
router.get('/:id', contract_controller.get);

//@Route: contracts/endat/:id
router.get('/endat/:id', contract_controller.endAt);

//@Route: contracts/isFired/:id
router.get('/isfired/:id', contract_controller.isFired);

//@Route: contracts/fire/:id
router.get('/fire/:id', contract_controller.fire);

//@Route: contracts/prolonge/:id
router.get('/prolonge/:id', contract_controller.prolongation);

//@Route: contracts/hire/:id
router.post('/hire/:id', contract_middleware.isHired, contract_controller.hire);


module.exports = router;