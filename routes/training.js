var express = require('express');
var router = express.Router();
var training_controller = require('../controllers/training.controller');

router.post('/event', training_controller.postEvent);
router.get('/projects/download',training_controller.downloadProjectsCSV);
router.get('/users/download',training_controller.downloadUsersCSV);
module.exports = router;