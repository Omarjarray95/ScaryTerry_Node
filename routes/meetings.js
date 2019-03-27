var express = require('express');
var Meeting = require('../models/Meeting');
var router = express.Router();

router.get('/', function(req, res){
    console.log('Getting all Meetings');
    Meeting.find({}).exec(function(err, meetings){
        if(err) {
            res.send('error has occured');
        } else {
            console.log(meetings);
            res.json(meetings);
        }
    });
});
router.get('/dailymeeting', function(req, res){
    console.log('Getting all Daily Meetings');
    Meeting.find({"name":"DM"}).exec(function(err, meetings){
        if(err) {
            res.send('error has occured');
        } else {
            console.log(meetings);
            res.json(meetings);
        }
    });
});
router.get('/sprintplanning', function(req, res){
    console.log('Getting all Sprint planning Meetings');
    Meeting.find({"name":"SP"}).exec(function(err, meetings){
        if(err) {
            res.send('error has occured');
        } else {
            console.log(meetings);
            res.json(meetings);
        }
    });
});
router.get('/retrospective', function(req, res){
    console.log('Getting all Retrospective Meetings');
    Meeting.find({"name":"RETRO"}).exec(function(err, meetings){
        if(err) {
            res.send('error has occured');
        } else {
            console.log(meetings);
            res.json(meetings);
        }
    });
});
router.get('/sprintreviews', function(req, res){
    console.log('Getting all Meetings');
    Meeting.find({"name":"SR"}).exec(function(err, meetings){
        if(err) {
            res.send('error has occured');
        } else {
            console.log(meetings);
            res.json(meetings);
        }
    });
});

router.get('/find/:id', function(req, res){
    console.log('getting one meeting');
    Meeting.findOne({
        _id: req.params.id
    }).exec(function(err, meeting){
        if(err) {
            res.send("Couldn't find meeting.");
        } else {
            console.log(meeting);
            res.json(meeting);
        }
    });
});

router.post('/', function(req, res){
    var newMeeting = new Meeting();
    newMeeting.time_start = req.body.time_start;
    newMeeting.time_end = req.body.time_end;
    newMeeting.name = req.body.name;
    newMeeting.save(function(err, meeting){
        if(err) {
            res.send('error saving meeting');
        } else {
            console.log(meeting);
            res.send(meeting);
        }
    });
});
//old update method , less efficient
/*
router.put('/:id', function(req, res){
    Meeting.findOneAndUpdate({
        _id: req.params.id
    },{
        $set: {
            time_start = req.body.time_start,
            time_end = req.body.time_end,
            name = req.body.name
        }
    },{
        upsert: true
    },function(err, newMeeting){
        if(err) {
            res.send('error updating meeting');
        } else {
            console.log(newMeeting);
            res.send(newMeeting);
        }
    });
});
*/


router.put('/:id', function(req, res, next)
{
    var time_start = req.body.time_start;
    var time_end = req.body.time_end;
    var name = req.body.name
    var description = req.body.description;

    Meeting.findOne({"_id": req.params.id}, function (error, meeting)
    {
        meeting.time_start = time_start;
        meeting.time_end = time_end;
        meeting.name = name;
        meeting.save();
    })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The meeting Has Been Updated Successfully !");

        })
        .catch(error =>
        {      
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});



router.delete('/:id', function(req, res){
    Meeting.findByIdAndRemove({
        _id: req.params.id
    },function(err, meeting){
        if(err) {
            res.send('error deleting meeting');
        } else {
            console.log(meeting);
            res.send(meeting);
        }
    });
});

module.exports = router;