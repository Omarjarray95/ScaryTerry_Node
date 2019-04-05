var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const perf_utils = require('../utils/PerformanceUtils');

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
            if (new Date(s.startDate.getTime() + (s.duration * 3600000 * 24)) < new Date(to)) {
                for (let t of s.sprintBacklog) {
                    if (t.resource == userID) {
                        tasks.push(t);
                        numberOfTasks++;
                        if (t.state == 'Done') {
                            numberOfTasksDone++;
                        }
                    }
                }
            }
        }
        console.log("tasks" + tasks);
        res.json((numberOfTasksDone / numberOfTasks) * 10);
    }).catch(err => {
        res.status(500).send(err);
    });

    /*sprint.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "resource",
                foreignField: "_id",
                as: "users"
            }
        },
        {
            $match: {
                { users: { $elemMatch: { _id: mongoose.Types.ObjectId(userID) } } }
            }
        }

    ]).then(data => {
        console.log(data);
        res.json(data);
    }).catch(err => {
        res.status(500).send(err);
    });*/
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
            if (new Date(s.startDate.getTime() + (s.duration * 3600000 * 24)) < new Date(to)) {
                for (let t of s.sprintBacklog) {
                    if (t.resource == userID && t.state == 'Done') {
                        numberOftasks++;
                        tasks.push(t);
                        avgTimeTofinishTask += t.duration / t.estimatedTime;
                    }
                }
            }
        }
        let a = Number(avgTimeTofinishTask) / numberOftasks;
        let b = a.toFixed(4);

        res.json(b * 100 + '%');
    }).catch(err => {
        res.status(500).send(err);
    });
});
router.get('/gettechnicalperformance/:from/:to/:userID', async (req, res) => {
    let result = await perf_utils.getTechnicalPerformanceNote(new Date(req.params.from), new Date(req.params.to), req.params.userID, function (result) {
        res.status(200).send({ result });
    });
});
module.exports = router;