var express = require('express');
var router = express.Router();
var Absenteeism_controller = require('../controllers/AbsenteeismController');
router.get('/getConnections/:from/:to/:id', Absenteeism_controller.get_connections_perUser);
router.post('/addAbsenteeism', Absenteeism_controller.add_absenteeism);
router.get('/countAbsenteeism/:from/:to/:id', Absenteeism_controller.count_absenteeism);
router.get('/absenteeismNote/:from/:to/:id', Absenteeism_controller.absenteeism_note);
router.get('/absenteeismWithDates/:from/:to/:id', Absenteeism_controller.absenteeism_withDates);





module.exports = router;