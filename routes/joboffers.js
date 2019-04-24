var express = require('express');
var router = express.Router();
var jobOffer_controller = require('../controllers/joboffer.controller');

router.post('/', jobOffer_controller.add);
router.get('/', jobOffer_controller.get);
router.get('/:offer/applications', jobOffer_controller.getApplications);
router.get('/filter/:id', jobOffer_controller.filterResumes);
router.get('/downloadcsv',jobOffer_controller.downloadCSV);

module.exports = router;