var express = require('express');
var router = express.Router();
var Communication_controller = require('../controllers/CommunicationController');
router.post('/insertMNC', Communication_controller.insert_MeetingNoteCriteria_test);
router.post('/insertMN', Communication_controller.insert_MeetingNote_test);
router.get('/getmeetingNote/:importance/:criteria/:from/:to', Communication_controller.getmeeting_Note_ByCriteria);
router.get('/communicationNote/:from/:to', Communication_controller.communication_Note);
module.exports = router;