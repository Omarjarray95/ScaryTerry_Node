var express = require('express');
var Meeting = require('../models/Meeting');
var Project = require('../models/Project');
var Job = require('../models/ScheduleJob');
var router = express.Router();
var schedule = require('node-schedule');
var jobs = [];


var time_between_attendance_check_and_event = 15 * 1000;

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

//Returns upcoming meetings by user

//Returns todays meeting by user
// get all the users


//Returns All meetings by user
router.get('/allmeetingsbyuser/:id', function(req, res) {
    console.log('getting all meetings');
    Project.find({
        $or: [{
                'developmentTeam': {
                    "$in": [req.params.id]
                }
            },
            {
                'productOwner': req.params.id
            },
            {
                'scrumMaster': req.params.id
            }
        ]
    }, function(err, projects) {
        if (err) throw err;
        Meeting.find({
            'Sprint': {
                $in: [].concat(...projects.map(x => x.sprints))
            }
        }, function(err, meetings) {
            if (err) throw err;
            res.json(meetings);
        });
    });
});

/*
.find(
    {"_id": {$ne:prjct._id},
        $or: [{
            $and:[{
                endDate:{$gte:prjct.startDate}},
                {endDate:{$lte:prjct.endDate}
            }]},
            {$and:[{
                    startDate:{$gte:prjct.startDate}},
                    {startDate:{$lte:prjct.endDate}
                }]}
        ]})

*/

//Returns All meetings by user
router.get('/nextmeeting/:id', function(req, res) {
    console.log('getting next meeting');
    Project.find({
        $or: [{
                'developmentTeam': {
                    "$in": [req.params.id]
                }
            },
            {
                'productOwner': req.params.id
            },
            {
                'scrumMaster': req.params.id
            }
        ]
    }, function(err, projects) {
        if (err) throw err;
        Meeting.find(

            {
                $and: [{
                        time_start: {
                            $gte: Date.now()
                        }
                    },
                    {
                        'Sprint': {
                            $in: [].concat(...projects.map(x => x.sprints))
                        }
                    }
                ]
            }
                        ).sort(
            [['time_start', 1]]
        ).exec(function(err, meeting) {
            if(meeting.length)
            {
            res.json(meeting[0])
            }
            else{
                res.json(meeting)
            }
        });

    });
});
//Api to use in calendar 
router.get('/calendar/:id', function(req, res) {
    console.log('getting all meetings of user ');
    Project.find({
        $or: [{
                'developmentTeam': {
                    "$in": [req.params.id]
                }
            },
            {
                'productOwner': req.params.id
            },
            {
                'scrumMaster': req.params.id
            }
        ]
    }, function(err, projects) {
        if (err) throw err;
        Meeting.find({
            'Sprint': {
                $in: [].concat(...projects.map(x => x.sprints))
            }
        }, function(err, meetings) {
            if (err) throw err;
            res.json(meetings.map(x => JSON.parse(JSON.stringify({ id: x._id, title: x.name,start:x.time_start,end:x.time_end }))));
        });
    });
});






//Return meeting user by date



//Add new Meeting
router.post('/', function(req, res) {
    var newMeeting = new Meeting();
    newMeeting.time_start = req.body.time_start;
    newMeeting.time_end = req.body.time_end;
    newMeeting.name = req.body.name;
    newMeeting.Sprint=req.body.sprint;
    //test date
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    console.log(tomorrow.getDate());
    console.log(newMeeting.time_start.getDate());

    if (newMeeting.time_start > tomorrow) {
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
                SPprocess(newMeeting, req, res);
                break;
            case 'RETRO':
                console.log('retro boy');
                break;
            case 'DM':
                console.log('DM boy');
                break;
        }


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
    var eID = req.params.id;
    Meeting.findByIdAndRemove({
        _id: eID
    }, function(err, meeting) {
        if (err) {
            res.send('error deleting meeting');
        } else {
            res.send('Deleted successfully.');
        }
    });
    var job_related = jobs.find((element) => {
        return element.eventID == eID;
    });
    if (job_related != null) {
        job_related.cancel();

    }

    jobs.splice(jobs.indexOf(job_related), 1);

});


//if event is sprint planning
function SPprocess(meeting, req, res) {
    meeting.save(function(err, meeting) {
        if (err) {
            res.send('error saving meeting');
        } else {
            res.send(meeting);
        }
    });
    var j = schedule.scheduleJob(meeting.time_start, function() {
        StartingEvent(meeting);
    });
    j.eventID = meeting._id;
    j.type = 'SP';
    //storeJob(meeting._id,'EVENT_START',meeting.time_start);

    jobs.push(j);
    //console.log(jobs);
    var ACDate = new Date(meeting.time_start.getTime() - time_between_attendance_check_and_event);
    var j2 = schedule.scheduleJob(ACDate, () => {
        AttendanceCheck(meeting)
    })
    j2.eventID = meeting._id;
    j2.type = 'AC';
    //storeJob(meeting._id,'ATTENDANCE_CHECK',ACDate);

    jobs.push(j2);
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


//show all running jobs.
router.get('/runningjobs', function(req, res) {
    console.log('Schedule jobs.');
    res.json(jobs);
});


// reassign jobs , just in case backend server was down 
router.get('/reassignjobs', function(req, res) {
    console.log('Schedule jobs.');
    res.json(jobs);
});





//Check Attendees
function AttendanceCheck(meeting) {
    console.log("Attendance check at " + new Date(Date.now()).toLocaleString());
    cancelJob(meeting._id, 'ATTENDANCE_CHECK')
}

//test for starting event
function StartingEvent(meeting) {
    cancelJob(meeting._id, 'EVENT_START')
    console.log("Starting " + meeting.name + " at " + new Date(Date.now()).toLocaleString());
}

function storeJob(id, type, date) {
    var sj = new Job();
    sj.related_event = id;
    sj.name = type;
    sj.at = date;
    console.log(sj);
    sj.save(function(err, job) {
        if (err) {
            console.log(error);
        } else {
            console.log(job)
        }
    });

}

function cancelJob(id, type) {
    var job_related = jobs.find((element) => {
        return ((element.eventID == id) && (element.type == type));
    });
    if (job_related != null) {
        job_related.cancel();
    }

    jobs.splice(jobs.indexOf(job_related), 1);

    /*
        Job.deleteOne({"related_event": id,
        "name": type})
        .then(() =>
        {
            console.log("The Job Was Deleted Successfully !");
        })
        .catch(error =>
        {
            console.log(error)
        });
    */
}

function getTimeLeft(date){
    var countDownDate = date.getTime();

// Update the count down every 1 second

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
answer='';
if(days!=0){answer+=days+" days "}
if(hours!=0){answer +=hours+" hours "}
if(minutes!=0){answer +=minutes + " minutes"}
return answer;

}


module.exports = router;