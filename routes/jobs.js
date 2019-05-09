var express = require('express');
var router = express.Router();
var Jobs = require('../models/Job');

router.post('/', function(req,res){
    var title = req.body.title;
    var description = req.body.description;

    Jobs.create({title,description})
        .then(job=>{
            res.status(200).json(job);
        }).catch(err=>{
            res.status(500).json(err);
        })
});
router.get('/', function(req,res) {
    Jobs.find()
        .then(jobs=>{
            res.status(200).json(jobs);
        }).catch(err=>{
            res.status(500).json(err);
        })
});

module.exports = router;