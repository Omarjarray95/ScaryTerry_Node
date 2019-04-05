var express = require('express');
var router = express.Router();
var user = require('../models/User');
var sprint = require('../models/Sprint');
var userStory = require('../models/UserStory');
var item = require('../models/Item');
var increment = require('../models/Increment');
var mongoose = require('mongoose');

router.post('/adduserstory/:id', function (req, res, next)
{
    var element = req.body.item;
    var title = req.body.title;
    var description = req.body.description;
    var priority = req.body.priority;
    var estimatedTime = req.body.estimatedTime;
    var startDate = req.body.startDate;
    var duration = req.body.duration;
    var testDescription = req.body.testDescription;

    var US = new userStory(
        {
            item: element,
            title: title,
            description: description,
            priority: priority,
            estimatedTime: estimatedTime,
            startDate: startDate,
            duration: duration,
            testDescription: testDescription
        });

    US.save(function (error)
    {
        if (error)
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        }

        sprint.findOne({"_id": req.params.id}, function (error, sprint)
        {
            sprint.sprintBacklog.push(US._id);
            sprint.save(function (error)
            {
                if (error)
                {
                    res.set('Content-Type', 'text/html');
                    res.status(500).send(error);
                }
            });
        }).then(() =>
        {
            res.set('Content-Type', 'application/json');
            res.status(202).json(US);
        })
            .catch(error =>
            {
                res.set('Content-Type', 'text/html');
                res.status(500).send(error);
            });
    });
});

router.post('/updateuserstory/:id', function(req, res, next)
{
    var title = req.body.title;
    var description = req.body.description;
    var priority = req.body.priority;
    var element = req.body.item;
    var estimatedTime = req.body.estimatedTime;
    var startDate = req.body.startDate;
    var duration = req.body.duration;
    var testDescription = req.body.testDescription;

    userStory.findOne({"_id": req.params.id}, function (error, userStory)
    {
        userStory.item = element;
        userStory.title = title;
        userStory.description = description;
        userStory.priority = priority;
        userStory.estimatedTime = estimatedTime;
        userStory.startDate = startDate;
        userStory.duration = duration;
        userStory.testDescription = testDescription;
        userStory.save();
    })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The User Story Has Been Updated Successfully !");

        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/deleteuserstory/:id', function(req, res, next)
{
    userStory.deleteOne({"_id": req.params.id})
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The User Story Has Been Deleted Successfully !");
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/getsprintbacklog/:id', function (req, res, next)
{
    sprint.findOne({"_id": req.params.id}).populate('sprintBacklog')
        .then((data) =>
        {
            res.set('Content-Type', 'application/json');
            res.status(202).json(data.sprintBacklog);
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/deletesprintbacklog/:id', function (req, res, next)
{
    sprint.findOne({"_id": req.params.id}, function (error, sprint)
    {
        if (error)
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        }
        else
        {
            var stories = sprint.sprintBacklog;

            for (var id of stories)
            {
                userStory.remove({"_id": id}, function (error)
                {
                    if (error)
                    {
                        res.set('Content-Type', 'text/html');
                        res.status(500).send(error);
                    }
                });
            }
            sprint.sprintBacklog = [];
            sprint.save(function (error)
            {
                if (error)
                {
                    res.set('Content-Type', 'text/html');
                    res.status(500).send(error);
                }
            });
        }
    }).then(() =>
    {
        res.set('Content-Type', 'text/html');
        res.status(202).send("The Sprint Backlog Is Now Empty !");
    })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/affectresource/:id/:resource', function (req, res, next)
{
    userStory.findOne({"_id": req.params.id}, function (error, userStory)
    {
        userStory.resource = req.params.resource;
        userStory.save(function (error)
        {
            if (error)
            {
                res.set('Content-Type', 'text/html');
                res.status(500).send(error);
            }
        });
    }).then(() =>
    {
        res.set('Content-Type', 'text/html');
        res.status(202).send("The Resource Is Now Assigned To The User Story !");
    })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});


router.post('/checktitledescription', function (req, res, next)
{
    var title = req.body.title;
    var description = req.body.description;

    userStory.find({$or : [{title: title}, {description: description}]})
        .then((data) =>
        {
            if (data.length === 0)
            {
                res.set('Content-Type', 'text/html');
                res.status(202).send(true);
            }
            else
            {
                res.set('Content-Type', 'text/html');
                res.status(200).send(false);
            }
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/updatestate/:id/:state', function (req, res, next)
{
    userStory.findOne({"_id": req.params.id}, function (error, user_Story)
    {
        user_Story.state = req.params.state;
        user_Story.save(function (error)
        {
            if (error)
            {
                res.status(500).send(error);
            }
        })
    })
        .then((user_Story) =>
        {
            sprint.findOne({sprintBacklog:{$elemMatch:{$eq:req.params.id}}})
                .then((sprint) =>
                {
                    increment.findOne({"_id": sprint.supplement})
                        .populate('userStories')
                        .then((increment) =>
                        {
                            var US = increment.userStories.filter(function(us)
                            {
                                return us.id === user_Story.id;
                            });

                            if (req.params.state === "Done")
                            {
                                if (US.length === 0)
                                {
                                    increment.userStories.push(user_Story._id);
                                }
                            }
                            else
                            {
                                if (US.length > 0)
                                {
                                    increment.userStories.pull(user_Story.id);
                                }
                            }
                            increment.save(function (error)
                            {
                                if (error)
                                {
                                    res.status(500).send(error);
                                }
                                else
                                {
                                    userStory.aggregate([
                                            {$match:{"item": user_Story.item}},
                                            {$group:{
                                                    _id : "$state",
                                                    count: {$sum: 1}
                                            }}])
                                        .then((userStories) =>
                                        {
                                            var state = "";

                                            if (userStories.length === 1)
                                            {
                                                if (userStories[0]._id === "Done")
                                                {
                                                    state = "Done";
                                                }

                                                else if (userStories[0]._id === "Pending")
                                                {
                                                    state = "Pending";
                                                }

                                                else
                                                {
                                                    state = "In Progress"
                                                }
                                            }
                                            else
                                            {
                                                state = "In Progress"
                                            }

                                            item.findOne({"_id": user_Story.item}, function (error, item)
                                            {
                                                item.state = state;
                                                item.save(function (error)
                                                {
                                                    if (error)
                                                    {
                                                        res.status(500).send(error);
                                                    }
                                                    else
                                                    {
                                                        res.status(202).json(item);
                                                    }
                                                });
                                            });
                                        })
                                        .catch(error =>
                                        {
                                            res.status(500).send(error);
                                        });
                                }
                            });
                        })
                        .catch(error =>
                        {
                            res.status(500).send(error);
                        });
                })
                .catch(error =>
                {
                    res.status(500).send(error);
                });
        })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});

module.exports = router;