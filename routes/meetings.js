var express = require('express');
var Meeting = require('../models/Meeting');
var Project = require('../models/Project');
var Job = require('../models/ScheduleJob');
var Sprint = require('../models/Sprint');
var Question =require('../models/MeetingQuestion');
var Criteria =require('../models/MeetingNoteCriteria');
var Note =require('../models/MeetingNote');

var router = express.Router();
var schedule = require('node-schedule');
var jobs = [];
var randomHex = require('random-hex');
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;

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
            [
                ['time_start', 1]
            ]
        ).exec(function(err, meeting) {
            if (meeting.length) {
                res.json(meeting[0])
            } else {
                res.json(meeting)
            }
        });

    });
});



//add in calendar
router.post('/restadd', function(req, res) {
    console.log(req.body.newEvent);


    var event=req.body.newEvent;
    var meeting = new Meeting();
    meeting.time_start=event.start;
    meeting.time_end=event.end;
    meeting.name=event.title;
    meeting.Sprint=event.desc;
    console.log(event.desc);
    meeting.save(function(err, meeting) {

        if (err) {
            res.send('error saving meeting');
        } else {
            console.log('saving meeting')
            console.log(meeting);

            res.send(meeting);
            //console.log(meeting);
        }
    
}     ) });



//Add new Meeting
router.post('/restedit', function(req, res) {
    Meeting.findOne({
        "_id": req.body.event.id
    }, function(error, meeting) {
        if(req.body.event.allDay)
        {
            meeting.attendance.push(req.body.event.desc)
        }
        else
        {
            meeting.attendance.pull(req.body.event.desc)
//meeting.attendance=req.body.event.desc
        }
        
        meeting.save();
    })
    .then(() => {
        console.log(meeting);
        res.set('Content-Type', 'text/html');
        res.status(202).send("The meeting Has Been Updated Successfully !");
        
    })
    .catch(error => {
        res.set('Content-Type', 'text/html');
        res.status(500).send(error);
    });

 console.log(req.body.event);
 //res.send(202);
});

//Api to use in calendar 
router.get('/calendar', function(req, res) {
    console.log('getting all meetings of user ');
    var currentuser = req.query.user;
    console.log(req.query.user);
    Project.find({
        $or: [{
                'developmentTeam': {
                    "$in": [currentuser]
                }
            },
            {
                'productOwner': currentuser
            },
            {
                'scrumMaster': currentuser
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
            Project.find({
                $and: [{
                        startDate: {
                            $lte: Date.now()
                        }
                    },
                    {
                        endDate: {
                            $gte: Date.now()
                        }
                    },
                    {
                        'scrumMaster': currentuser
                    }
                ]
            }, function(err, p) {
                if (err) throw err;
               
               
               // console.log(p);
                if (p.length != 0) {
                    res.json(meetings.map(x => JSON.parse(JSON.stringify({
                        id: x._id,
                        title: x.name,
                        start: x.time_start,
                        end: x.time_end,
                        scrummaster: true
                    }))));
                } else {
                    res.json(meetings.map(x => JSON.parse(JSON.stringify({
                        id: x._id,
                        title: x.name,
                        start: x.time_start,
                        end: x.time_end,
                        scrummaster: false
                    }))));
                

                }
            });
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
    newMeeting.Sprint = req.body.sprint;
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

function getTimeLeft(date) {
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
    answer = '';
    if (days != 0) {
        answer += days + " days "
    }
    if (hours != 0) {
        answer += hours + " hours "
    }
    if (minutes != 0) {
        answer += minutes + " minutes"
    }
    return answer;

}



//Api to use in calendar 
router.get('/api', function(req, res) {
    console.log('getting all meetings of user ');
    var currentuser = '5c913b531c9d44000018162b';
    Sprint.find()
    .populate('user')
    .populate('meal')
    .exec(function (err, results) {
         // callback
    

   // console.log(req.query.user);
    Project.find({
        $or: [{
                'developmentTeam': {
                    "$in": [currentuser]
                }
            },
            {
                'productOwner': currentuser
            },
            {
                'scrumMaster': currentuser
            }
        ]
    }, function(err, ps) {
        if (err) throw err;


        Project.populate(ps,[{path: "developmentTeam"},{path:  "productOwner"},{path: "scrumMaster"}],
        function(err,projects )
        {     
              //  projects.map((p)=>{p.color=randomHex.generate();console.log(randomHex.generate())})

             if(err) throw err;
            Meeting.find({
                'Sprint': {
                    $in: [].concat(...projects.map(x => x.sprints))
                }
            }, function(err, meetings) {
              // if(err) console.log(err);
                if (err) throw err;
                       
    
                        res.json(
                       meetings.map(x => JSON.parse(JSON.stringify({
                                    id: x._id,
                                    title: x.name,
                                    start: x.time_start,
                                    end: x.time_end,
                                    sprint:results.find(sp=>sp._id===x.Sprint),
                                    project: projects.find(m=>m.sprints.indexOf(x.Sprint)>-1)
                                })))
                                
                                
                           
                       
                    
                        );
        
            });
        });
 
        });});

       
});

//Api to use in calendar 
router.get('/api/getmeetings', function(req, res) {
    var currentuser = '5c913b531c9d44000018162b';
    Project.find(
        {
            $or: [{
                    'developmentTeam': {
                        "$in": [currentuser]
                    }
                },
                {
                    'productOwner': currentuser
                },
                {
                    'scrumMaster': currentuser
                }
            ]
        }
    )
    .populate('developmentTeam')
    .populate('productOwner')
    .populate('scrumMaster')
    .exec(function (err, projects) {
        Meeting.find({

            $and:[{
                'Sprint': {
                    $in: [].concat(...projects.map(x => x.sprints))
                }},
                {'Sprint': { $ne: null }
            }]
            
            
        })
        .populate('Sprint')
        .populate('Questions')
        .sort({time_start: 'descending'})
        .exec(function (err,meetings) {
            res.json(
                meetings.map(
                        
                        x =>
                         JSON.parse(JSON.stringify({
                             real_time_start: x.real_time_start,
                             real_time_end: x.real_time_end,
                             id: x._id,
                             title: x.name,
                             start: x.time_start,
                             end: x.time_end,
                             sprint:x.Sprint,
                             question:x.Questions,
                             project: projects.find(m=>m.sprints.indexOf(x.Sprint._id)>-1)
                         })))
                         
                         
                    
                
              
                 );
        });
    });

       
});

//get projects per user 
router.get('/api/getproject', function(req, res) {
  //  var currentuser = req.query.user;
  var currentuser = '5c913b531c9d44000018162b';

    Project.find({
        $or: [{
                'developmentTeam': {
                    "$in": [currentuser]
                }
            },
            {
                'productOwner': currentuser
            },
            {
                'scrumMaster': currentuser
            }
        ]
    }, function(err, ps){
        if(err){
            console.log(err);
            return
        }

        Project.populate(ps,[{path: "developmentTeam"},{path:  "productOwner"},{path: "scrumMaster"}],
        function(err,data )
        {   
        var i=0;
        res.json(data.map(
                        
            x =>
             JSON.parse(JSON.stringify({
                id   :i++ ,
                value:x._id,
                label:x.title,
                color:randomHex.generate(),
                scrumMaster:x.scrumMaster._id
             }))))})
       // console.log(data[0].name); 
    })
       
});

//Find MEETING by  given id
router.get('/findapi/:id', function(req, res) {
console.log(req.query.user);
var identity=req.query.user;
var token = new AccessToken(
    "AC19a15e3c2ebe4813272666fcb2f95272",
    "SKe73b0c4c999939d329691e81a8e93c7d",
    "R4pSojlcihmKu02hjS1jopces0Mcivc1"
);
token.identity = identity;

const grant = new VideoGrant();
// Grant token access to the Video API features
token.addGrant(grant);
   Meeting.findOne({_id:req.params.id}).populate('Questions')
    .exec(function (err, m) {
        Project.findOne({sprints:{$elemMatch:{$eq:m.Sprint}}})
              .populate('scrumMaster')
              .populate('developmentTeam')
              .populate('productOwner')
              .populate('sprints')
              .exec(function (err, results) {
                    Criteria.find().exec((err,dess)=>{
                        Note.find({during_event:m._id}).exec((err,desc)=>{

                            Meeting.populate(m,{path: "Impediment"},
                            function(err,data )
                            {   
                                res.json({
                                    project:results,
                                    meeting:data,
                                    identity: identity,
                                    token: token.toJwt(),
                                    criteria:dess,
                                    note:desc
                                })
                            })
                        
                    })
                    })
                   

            });
    });
});

//get projects per user 
router.get('/startapi/:id', function(req, res) {
    Meeting.findOne({_id:req.params.id})
    .exec(function (err, m) {
       m.real_time_start=Date.now();
       m.save()
    });
         
  });
  router.get('/ispresent/', function(req, res) {
    if(req.query.presence==="present")
    {  // console.log("present")
     
        console.log(req.query.meeting+" "+req.query.user)

        Meeting.findByIdAndUpdate(req.query.meeting,
            {$push: {attendance:req.query.user}},
            {safe: true, upsert: true},
            function(err, doc) {
                if(err){
                console.log(err);
                }else{
                    res.json({good:"good"})
                }
            }
        );


    }
    else
    {console.log("absent")




        Meeting.findByIdAndUpdate(req.query.meeting,
            {$pull: {attendance:req.query.user}},
            {safe: true, upsert: true},
            function(err, doc) {
                if(err){
                console.log(err);
                }else{
                    res.json({good:"good"})
                }
            }
        );
    }

         
  });

//add in calendar
router.get('/addquestion', function(req, res) {
    console.log(req.body.newEvent);


    //var question=req.query.question;
    var question = new Question();
    question.made_by=req.query.user;
    question.Question=req.query.content;

    question.save(function(err, meeting) {

        if (err) {
           console.log(err)
        } else {
            Meeting.findOne({_id:req.query.event}).exec(function(err, event) {
                if (err) {
                  console.log(err)
                } else {



                    console.log(meeting)
                    
                   // console.log(meetings);
                   event.Questions.push(meeting);
                   event.save((r,e)=>{if(e)console.log(e)})
                    res.json({good:"good"});
                }
            });
           
            //console.log(meeting);
        }
    
}     ) });


router.get('/bbaddmeeting', function(req, res) {
  //  console.log(req.body.newEvent);
    console.log(req.query.name)
    console.log(req.query.start)
    console.log(req.query.sprint)
     var meeting=new Meeting();

    //var question=req.query.question;
    //var question = new Question();
    //meeting.time_start.made_by=req.query.user;
    meeting.name=req.query.name;
    meeting.Sprint=req.query.sprint;
   meeting.time_start= new Date(req.query.start);

        console.log(req.query.name);
        console.log(req.query.sprint);
        console.log(req.query.start);

    meeting.save(function(err, meeting) {

        if (err) {
           console.log(err)
        } else {
            console.log(meeting)
            res.json(meeting)
        }
    
}     ) }
);
router.get('/getsprints', function(req, res) {
    //req.query.id
    console.log('getting all meetings of user ');
    //var currentuser = '5c913b531c9d44000018162b';
    Project.findOne({_id: req.query.id})
    .populate('sprints')
   
    .exec(function (err, results) {
         res.json(results.sprints)
       
});
}
);
console.log('getting one meeting');

router.get('/answer', function(req, res) {
    
    Question.findOne({
        "_id": req.query.id
    }, function(error, meeting) {
        if(error)
        {
            console.log(e)
        }
        else
        {
            meeting.Answer=req.query.answer;
            meeting.save();
            res.json({good:"gut"})
        }
       

    }
    )
});


router.get('/start', function(req, res) {
    
    Meeting.findOne({
        "_id": req.query.id
    }, function(error, meeting) {
        if(error)
        {
            console.log(e)
        }
        else
        {
            meeting.real_time_start=new Date();
            meeting.save();
            console.log(meeting)
            res.json({good:"gut"})
        }
       

    }
    )
});

router.get('/end', function(req, res) {
    
    Meeting.findOne({
        "_id": req.query.id
    }, function(error, meeting) {
        if(error)
        {
            console.log(e)
        }
        else
        {
            meeting.real_time_end=new Date();
            meeting.save();
            res.json({good:"gut"})
        }
       

    }
    )
});

router.get('/plus', function(req, res) {
    //  console.log(req.body.newEvent);
  //from to event criteria
    Note.findOneAndDelete({
        attributed_to:req.query.to,
        made_by:req.query.from,
        during_event:req.query.event,
        criteria:req.query.criteria,
        note:-1
    }).exec(function(err, meetings) {
        if(err)console.log(err)
        var note = new Note();
        note.made_by=req.query.from;
        note.date=new Date();
        note.attributed_to=req.query.to;
        note.note=1;
        note.during_event=req.query.event
        note.criteria=req.query.criteria
       
        
        note.save(function(err, meeting) {
    
            if (err) {
               console.log(err)
            } else {
               res.json({good:"gut"})
               console.log(meeting);
                //console.log(meeting);
            }
        
    }     )
    });
  
      //var question=req.query.question;
       });
router.get('/minus', function(req, res) {
    //  console.log(req.body.newEvent);
  //from to event criteria
    Note.findOneAndDelete({
        attributed_to:req.query.to,
        made_by:req.query.from,
        during_event:req.query.event,
        criteria:req.query.criteria,
        note:1
    }).exec(function(err, meetings) {
        if(err)console.log(err)
        var note = new Note();
        note.made_by=req.query.from;
        note.date=new Date();
        note.attributed_to=req.query.to;
        note.note=-1;
        note.during_event=req.query.event
        note.criteria=req.query.criteria
       
        
        note.save(function(err, meeting) {
    
            if (err) {
               console.log(err)
            } else {
               res.json({good:"gut"})
               console.log(meeting);
                //console.log(meeting);
            }
        
    }     )
    });
  
      //var question=req.query.question;
       });
  
/*

app.get("/token", function(request, response) {
    var identity = faker.name.findName();

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    var token = new AccessToken(
        "AC19a15e3c2ebe4813272666fcb2f95272",
        "SKe73b0c4c999939d329691e81a8e93c7d",
        "R4pSojlcihmKu02hjS1jopces0Mcivc1"
    );

    // Assign the generated identity to the token
    token.identity = identity;

    const grant = new VideoGrant();
   // Grant token access to the Video API features
   token.addGrant(grant);

   // Serialize the token to a JWT string and include it in a JSON response
   response.send({
       identity: identity,
       token: token.toJwt()
   });
});

*/
module.exports = router;