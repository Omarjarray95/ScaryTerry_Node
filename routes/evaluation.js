var express = require('express');
var router = express.Router();
var evaluation_controller = require('../controllers/AffectEvalController');
router.post('/addEval', evaluation_controller.add_evaluation);
router.post('/connection/:id', evaluation_controller.add_connection_location);
router.get('/connection/:date/:id', evaluation_controller.is_ponctual);


module.exports = router;