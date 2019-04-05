var express = require('express');
var router = express.Router();
var appliers_controller = require('../controllers/applier.controller');

router.get('/', appliers_controller.get);
router.post('/', appliers_controller.post);
router.delete('/:id', appliers_controller.deleteById);
router.get('/restore/:id', appliers_controller.restore);
router.get('/archived', appliers_controller.getArchived);
router.put('/:id', appliers_controller.update);

module.exports = router;