var express = require('express');
var Criteria = require('../models/MeetingNoteCriteria');
var router = express.Router();

router.get('/', function(req, res){
    console.log('Getting all Criterias');
    Criteria.find({}).exec(function(err, criterias){
        if(err) {
            res.send('error has occured');
        } else {
            console.log(criterias);
            res.json(criterias);
        }
    });
});

router.get('/find/:id', function(req, res){
    console.log('getting one criteria');
    Criteria.findOne({
        _id: req.params.id
    }).exec(function(err, criteria){
        if(err) {
            res.send("Couldn't find criteria.");
        } else {
            console.log(criteria);
            res.json(criteria);
        }
    });
});

router.post('/', function(req, res){
    var newCriteria = new Criteria();
    newCriteria.name = req.body.name;
    newCriteria.description = req.body.description;
    newCriteria.criteria_nature = req.body.criteria_nature;
    newCriteria.importance = req.body.importance;
    newCriteria.save(function(err, criteria){
        if(err) {
            res.send('error saving criteria');
        } else {
            console.log(criteria);
            res.send(criteria);
        }
    });
});

router.put('/:id', function(req, res, next)
{
    var name = req.body.name;
    var description = req.body.description;
    var criteria_nature = req.body.criteria_nature
    var importance = req.body.importance;

    Criteria.findOne({"_id": req.params.id}, function (error, criteria)
    {
        criteria.name= name;
        criteria.description = description;
        criteria.criteria_nature = criteria_nature;
        criteria.importance=importance;
        criteria.save();
    })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The criteria Has Been Updated Successfully !");

        })
        .catch(error =>
        {      
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});



router.delete('/:id', function(req, res){
    Criteria.findByIdAndRemove({
        _id: req.params.id
    },function(err, criteria){
        if(err) {
            res.send('error deleting criteria');
        } else {
            console.log(criteria);
            res.send(criteria);
        }
    });
});

module.exports = router;