var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/testcodes');
    },
    filename: function (req, file, cb) {
        //TODO: To Eliminate the case of duplicate name , i could do a name generator
        const ext = file.originalname.split('.').pop();
        const now = new Date(Date.now());
        cb(null, file.fieldname + '-' + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + '.' + ext);
    }
});

var upload = multer({ storage: storage });

var test_controller = require('../controllers/recruitmentTest.controller');

router.post('/generate', test_controller.generateTest);

router.put('/submit/:id/code', upload.single('code'), test_controller.submitCode);

router.put('/submit/:id/quiz', test_controller.submitQuiz);

router.post('/', test_controller.add);

router.put('/:id', test_controller.update);

router.get('/:id', test_controller.get);

router.get('/', test_controller.getAll);

router.get('/run/:id', test_controller.testCode);

router.get('/validate/:id/code', test_controller.validateCode);

router.get('/validate/:id/quiz', test_controller.validateQuiz);

module.exports = router;