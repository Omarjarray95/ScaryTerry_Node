var express = require('express');
var Meeting = require('../models/Meeting');
var router = express.Router();
var schedule = require('node-schedule');

//ALL MEETINGS
router.get('/', function(req, res) {
    console.log('Getting all Meetings');
    Meeting.find({}).exec(function(err, meetings) {
        if (err) {
            res.send('error has occured');
        } else {
            console.log(meetings);
            res.json(meetings);
        }
    });
});

//ALL DAILY MEETINGS
router.get('/dailymeeting', function(req, res) {
    console.log('Getting all Daily Meetings');
    Meeting.find({
        "name": "DM"
    }).exec(function(err, meetings) {
        if (err) {
            res.send('error has occured');
        } else {
            console.log(meetings);
            res.json(meetings);
        }
    });
});

//ALL SPRINT PLANNING MEETINGS
router.get('/sprintplanning', function(req, res) {
    console.log('Getting all Sprint planning Meetings');
    Meeting.find({
        "name": "SP"
    }).exec(function(err, meetings) {
        if (err) {
            res.send('error has occured');
        } else {
            console.log(meetings);
            res.json(meetings);
        }
    });
});

//ALL RETROSPECTIVE MEETINGS
router.get('/retrospective', function(req, res) {
    console.log('Getting all Retrospective Meetings');
    Meeting.find({
        "name": "RETRO"
    }).exec(function(err, meetings) {
        if (err) {
            res.send('error has occured');
        } else {
            console.log(meetings);
            res.json(meetings);
        }
    });
});

//ALL SPRINT REVIEW MEETINGS
router.get('/sprintreviews', function(req, res) {
    console.log('Getting all Meetings');
    Meeting.find({
        "name": "SR"
    }).exec(function(err, meetings) {
        if (err) {
            res.send('error has occured');
        } else {
            console.log(meetings);
            res.json(meetings);
        }
    });
});

//Find MEETING by  given id
router.get('/find/:id', function(req, res) {
    console.log('getting one meeting');
    Meeting.findOne({
        _id: req.params.id
    }).exec(function(err, meeting) {
        if (err) {
            res.send("Couldn't find meeting.");
        } else {
            console.log(meeting);
            res.json(meeting);
        }
    });
});

//Add new Meeting
router.post('/', function(req, res) {
    var newMeeting = new Meeting();
    newMeeting.time_start = req.body.time_start;
    newMeeting.time_end = req.body.time_end;
    newMeeting.name = req.body.name;

    //test date
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    console.log(tomorrow.getDate());
    console.log(newMeeting.time_start.getDate());

    if (newMeeting.time_start < tomorrow) {
        res.send("can't make any appointment before tomorrow.");
    } else if (newMeeting.time_start.getFullYear() != newMeeting.time_end.getFullYear()) {
        res.send("Meeting should start and end the same day.");
    } else if (newMeeting.time_start.getDate() != newMeeting.time_end.getDate()) {
        res.send("Meeting should start and end the same day.");
    } else if (newMeeting.time_start.getDate() != newMeeting.time_end.getDate()) {
        res.send("Meeting should start and end the same day.");
    } else if (newMeeting.time_start.getTime() > newMeeting.time_end.getTime()) {
        res.send("Meeting should start before it ends.");
    } else {
        switch (newMeeting.name) {
            case 'SP':
                SPprocess(newMeeting);
                break;
            case 'RETRO':
                console.log('retro boy');
                break;
            case 'DM':
                console.log('DM boy');
                break;
        }
        newMeeting.save(function(err, meeting) {
            if (err) {
                res.send('error saving meeting');
            } else {
                res.send(meeting);
            }
        });


    }
});

//Update MEETING by  given id
router.put('/:id', function(req, res, next) {
    var time_start = req.body.time_start;
    var time_end = req.body.time_end;
    var name = req.body.name
    var description = req.body.description;

    Meeting.findOne({
            "_id": req.params.id
        }, function(error, meeting) {
            meeting.time_start = time_start;
            meeting.time_end = time_end;
            meeting.name = name;
            meeting.save();
        })
        .then(() => {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The meeting Has Been Updated Successfully !");

        })
        .catch(error => {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

//Delete MEETING by  given id
router.delete('/:id', function(req, res) {
    Meeting.findByIdAndRemove({
        _id: req.params.id
    }, function(err, meeting) {
        if (err) {
            res.send('error deleting meeting');
        } else {
            console.log(meeting);
            res.send(meeting);
        }
    });
});

function SPprocess(meeting) {
    console.log("this is SP process stuff");
}
//store meeting in db 
function storeMeetingInDB(Meeting, req, res) {
    Meeting.save(function(err, meeting) {
        if (err) {
            res.send('error saving meeting');
        } else {
            res.send(meeting);
        }
    });
}
module.exports = router;