var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var test_controller = require('../controllers/recruitmentTest.controller');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/testcodes');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
router.get('/generate', test_controller.generateTest);

router.post('/', upload.single('code'), test_controller.add);

router.get('/:id', test_controller.get);

router.get('/', test_controller.getAll);


module.exports = router;