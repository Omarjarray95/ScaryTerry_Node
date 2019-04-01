var express = require('express');
var router = express.Router();
var motivation_controller = require('../controllers/MotivationController');
router.get('/isPonctual/:date/:id', motivation_controller.is_ponctual);
router.get('/isDayOff/:date/:id', motivation_controller.is_dayoff);
router.get('/isAbsent/:date/:id', motivation_controller.is_absent);
router.get('/atCompany', motivation_controller.at_company);
router.get('/drp/:from/:to/:id', motivation_controller.duration_perUSer_Punctuality);
router.post('/insertDayOff/:date/:id', motivation_controller.insert_dayOff);
router.get('/countDayOff/:from/:to/:id', motivation_controller.count_dayOff);
router.get('/dayOffNote/:from/:to/:id', motivation_controller.day_offNote);
router.get('/dayOffWithDates/:from/:to/:id', motivation_controller.dayOff_withDates);





module.exports = router;