var express = require('express');
var router = express.Router();
const rand = require('random');
var mongoose = require('mongoose');
const perf_utils = require('../utils/PerformanceUtils');
var connLoc = require('../models/ConnectionLocation')
var sprint = require('../models/Sprint');
var userStory = require('../models/UserStory');
router.post('/addsprint', function (req, res, next) {
    var goal = req.body.goal;
    var description = req.body.description;
    var duration = req.body.duration;

    var S = new sprint(
        {
            goal: goal,
            description: description,
            startDate: new Date(),
            duration: duration
        });

    S.save(function (err, doc) {
        if (err) {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        } else
            res.status(200).json(doc);
    });
});
router.post('/adduserstory/:id', function (req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var priority = req.body.priority;
    var estimatedTime = req.body.estimatedTime;

    var US = new userStory(
        {
            title: title,
            description: description,
            priority: priority,
            estimatedTime: estimatedTime
        });

    US.save(function (error) {
        if (error) {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        }

        sprint.findOne({ "_id": req.params.id }, function (err, sprint) {
            console.log(sprint);
            sprint.sprintBacklog.push(US._id);
            sprint.save(function (error, doc) {
                if (error) {
                    res.set('Content-Type', 'text/html');
                    res.status(500).send(error);
                }
                else
                    res.status(200).json(doc);

            });
        });
    });
});

router.get('/getPerformance/:from/:to/:userID', function (req, res, next) {
    var to = new Date(req.params.to);
    var from = new Date(req.params.from);
    var userID = req.params.userID;
    let tasks = [];
    let numberOfTasks = 0;
    let numberOfTasksDone = 0;
    console.log(from);
    console.log(to);
    sprint.find({
        startDate: { '$lt': to, '$gte': from }
    }).populate('sprintBacklog').exec().then(sprints => {
        console.log(sprints);
        for (let s of sprints) {
            // if (new Date(s.startDate.getTime() + (s.duration * 3600000 * 24)) < new Date(to)) {
            for (let t of s.sprintBacklog) {
                if (t.resource == userID) {
                    tasks.push(t);
                    numberOfTasks++;
                    if (t.state == 'Done') {
                        numberOfTasksDone++;
                    }
                }
            }
            //}
        }
        console.log("tasks" + tasks);
        res.json((numberOfTasksDone / numberOfTasks) * 10);
    }).catch(err => {
        res.status(500).send(err);
    });
});



router.get('/getperformancevelocity/:from/:to/:userID', function (req, res, next) {
    var to = new Date(req.params.to);
    var from = new Date(req.params.from);
    var userID = req.params.userID;
    let tasks = [];
    let avgTimeTofinishTask = 0;
    let numberOftasks = 0;
    console.log(from);
    console.log(to);
    sprint.find({
        startDate: { '$lt': to, '$gte': from }
    }).populate('sprintBacklog').exec().then(sprints => {
        // console.log(sprints);
        for (let s of sprints) {
            //if (new Date(s.startDate.getTime() + (s.duration * 3600000 * 24)) < new Date(to)) {
            for (let t of s.sprintBacklog) {
                if (t.resource == userID && t.state == 'Done') {
                    numberOftasks++;
                    tasks.push(t);
                    console.log('rr :' + t.duration / t.estimatedTime)
                    avgTimeTofinishTask += t.duration / t.estimatedTime;
                    console.log('avg : ' + avgTimeTofinishTask)
                }
            }
            //}
        }
        let a = Number(avgTimeTofinishTask) / numberOftasks;
        let b = a.toFixed(4);
        console.log(tasks)
        res.json(b * 100 + '%');
    }).catch(err => {
        res.status(500).send(err);
    });
});

router.get('/getPerformanceStats/:from/:to/:userID', async function (req, res, next) {
    var to = new Date(req.params.to);
    var from = new Date(req.params.from);
    var userID = req.params.userID;
    let tasks = [];
    let numberOfAllTasks = 0;
    let numberOfAllTasksDone = 0;
    let numberOfTasks = 0;
    let numberOfTasksDone = 0;
    let ratio = [];
    console.log(from);
    console.log(to);
    while (from < to) {
        numberOfTasks = 0;
        numberOfTasksDone = 0;
        let f = new Date(yyyymmdd(from));
        let t = new Date(yyyymmdd(new Date(from.setMonth(from.getMonth() + 1))));
        await sprint.find({
            startDate: { '$lt': t, '$gte': f }
        }).populate('sprintBacklog').exec().then(sprints => {
            console.log('f :' + f)
            console.log('t :' + t)
            //console.log('Sprints : ' + sprints);
            for (let s of sprints) {
                // if (new Date(s.startDate.getTime() + (s.duration * 3600000 * 24)) < new Date(to)) {
                for (let t of s.sprintBacklog) {
                    if (t.resource == userID) {
                        //tasks.push(t);
                        numberOfTasks++;
                        numberOfAllTasks++;
                        if (t.state == 'Done') {
                            numberOfTasksDone++;
                            numberOfAllTasksDone++;
                        }
                    }
                }
                //}
            }
            if (numberOfTasksDone != 0) {
                ratio.push(Number((numberOfTasksDone / numberOfTasks) * 100).toFixed(1))
            } else {
                ratio.push(0)
            }
            //console.log("tasks" + tasks);
            //res.json((numberOfTasksDone / numberOfTasks) * 10);
        }).catch(err => {
            //res.status(500).send(err);
        });
        /*console.log('f :' + f);
        console.log('t :' + t);*/
    }
    res.send({ ratio, numberOfAllTasks, numberOfAllTasksDone });
});

router.get('/getperformancevelocityStats/:from/:to/:userID', async function (req, res, next) {
    var to = new Date(req.params.to);
    var from = new Date(req.params.from);
    var userID = req.params.userID;
    let tasks = [];
    let avgTimeTofinishTask = 0;
    let numberOftasks = 0;
    let allDuration = 0;
    let allEstimated = 0;
    let avg = [];
    console.log(from);
    console.log(to);
    while (from < to) {
        numberOftasks = 0;
        avgTimeTofinishTask = 0;
        let f = new Date(yyyymmdd(from));
        let t = new Date(yyyymmdd(new Date(from.setMonth(from.getMonth() + 1))));
        await sprint.find({
            startDate: { '$lt': t, '$gte': f }
        }).populate('sprintBacklog').exec().then(sprints => {
            console.log('f :' + f)
            console.log('t :' + t)
            //console.log('sprints' + sprints);
            for (let s of sprints) {
                //if (new Date(s.startDate.getTime() + (s.duration * 3600000 * 24)) < new Date(to)) {
                for (let t of s.sprintBacklog) {
                    if (t.resource == userID && t.state == 'Done') {
                        numberOftasks++;
                        tasks.push(t);
                        avgTimeTofinishTask += t.duration / t.estimatedTime;
                        allDuration += t.duration;
                        allEstimated += t.estimatedTime;
                    }
                }
                //}
            }
            if (numberOftasks != 0) {
                avg.push(Number((avgTimeTofinishTask / numberOftasks) * 100).toFixed(1))
            }
            else {
                avg.push(0);
            }
            /* let a = Number(avgTimeTofinishTask) / numberOftasks;
             let b = a.toFixed(4);*/

            // res.json(b * 100 + '%');
        }).catch(err => {
            //  res.status(500).send(err);
        });

    }
    console.log(avgTimeTofinishTask)
    console.log('tasks :' + tasks)
    res.send({ avg, allDuration, allEstimated });
});


router.get('/gettechnicalperformance/:from/:to/:userID', async (req, res) => {
    let result = await perf_utils.getTechnicalPerformanceNote(3, 'technical', new Date(req.params.from), new Date(req.params.to), req.params.userID, function (result) {
        res.status(200).send({ result });
    });
});
router.get('/gettechCommperformanceStats/:from/:to/:userID', async (req, res) => {
    var to = new Date(req.params.to);
    var from = new Date(req.params.from);
    var ff = new Date(req.params.from);

    let rtech = [];
    let rcomm = [];
    let i = 1;
    while (i <= 5) {
        let rintech = [];
        let rinComm = [];
        console.log('this is i' + i);

        from = new Date(ff);
        console.log('new from :' + from);
        while (from < to) {

            let f = new Date(yyyymmdd(from));
            let t = new Date(yyyymmdd(new Date(from.setMonth(from.getMonth() + 1))));

            let result = await perf_utils.getTechnicalPerformanceNote(i, 'technical', f, t, req.params.userID, function (result) {
                rintech.push(result);
            });
            let result2 = await perf_utils.getTechnicalPerformanceNote(i, 'moral', f, t, req.params.userID, function (result) {
                rinComm.push(result);
            });
        }
        rcomm.push(rinComm);
        rtech.push(rintech);
        i++;
    }
    res.status(200).send({ rtech, rcomm });
});


//not finished yet 
function x(from, to) {
    f = new Date(from);
    t = new Date(to);
    let conloc = {};

    let rs = [];
    console.log('this is f  :' + f)
    console.log('this is t  :' + t)
    let index = 1;
    while (f < t) {
        let dateStart = new Date(f);
        let dateEnd = new Date(f);
        let time = rand.int(min = 1, max = 3)
        let occ_in_day = rand.int(min = 1, max = 3);
        let minutes = rand.int(min = 16, max = 300);
        let days = rand.int(min = 1, max = 3);
        console.log('random = ' + days);
        if (occ_in_day == 1) {
            if (time == 1) {
                dateStart.setHours(rand.int(min = 10, max = 11));
                dateEnd.setHours(rand.int(min = 13, max = 19))
            } else if (time == 2) {

            } else {

            }
        } else if (occ_in_day == 2) {

        }
        else {

        }


        f.setDate(f.getDate() + days);
        console.log(f);
    }
}
x('2016-01-01', '2016-02-01');



function yyyymmdd(now) {

    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    return '' + y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}
module.exports = router;