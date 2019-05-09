var express = require('express');
var router = express.Router();
var user = require('../models/User');
var sprint = require('../models/Sprint');
var userStory = require('../models/UserStory');
var item = require('../models/Item');
var increment = require('../models/Increment');
var project = require('../models/Project');
var mongoose = require('mongoose');
var moment = require('moment');

router.post('/adduserstory/:id', function (req, res, next)
{
    var element = req.body.item;
    var title = req.body.title;
    var description = req.body.description;
    var priority = req.body.priority;
    var estimatedTime = req.body.estimatedTime;
    var startDate = req.body.startDate;
    var duration = req.body.duration;
    var resource = req.body.resource;
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
            resource: resource,
            testDescription: testDescription
        });

    US.save(function (error)
    {
        if (error)
        {
            res.status(500).send(error);
        }

        sprint.findOne({"_id": req.params.id}, function (error, sprint)
        {
            sprint.sprintBacklog.push(US._id);
            sprint.save(function (error)
            {
                if (error)
                {
                    res.status(500).send(error);
                }

                project.findOne({sprints:{$elemMatch:{$eq:req.params.id}}})
                    .populate('program field entreprise skills productOwner scrumMaster developmentTeam sprints')
                    .populate({
                        path: 'productBacklog',
                        populate: { path: 'items', options: { sort: 'priority'} }
                    })
                    .then((project) =>
                    {
                        res.status(202).json(project);
                    })
                    .catch((error) =>
                    {
                        res.status(500).send(error);
                    });
            });
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
    var resource = req.body.resource;
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
        userStory.resource = resource;
        userStory.testDescription = testDescription;
        userStory.save();
    })
        .then(() =>
        {
            res.status(202).send("The User Story Has Been Updated Successfully !");

        })
        .catch(error =>
        {
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
    sprint.findOne({"_id": req.params.id}).
    populate({
        path: 'sprintBacklog',
        populate: { path: 'item resource' },
        options: { sort: {'priority': -1}}})
        .then((data) =>
        {
            res.status(202).json(data.sprintBacklog);
        })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});

router.get('/getitemsbystate/:id/:state', function (req, res, next)
{
    sprint.aggregate([
        { $match : { "_id": mongoose.Types.ObjectId(req.params.id) } },
        // Unwind the source
        { "$unwind": "$sprintBacklog" },
        // Do the lookup matching
        { "$lookup": {
                "from": "userstories",
                "localField": "sprintBacklog",
                "foreignField": "_id",
                "as": "userStories"
            }},
        // Unwind the result arrays ( likely one or none )
        { "$unwind": "$userStories" },
        // Group back to arrays
        { "$group": {
                "_id": "$_id",
                "sprintBacklog": { "$push": "$sprintBacklog" },
                "userStories": { "$push": "$userStories" }
            }},
        {
            $project: {
                _id: 0,
                userStories: {
                    $filter: {
                        input: "$userStories",
                        as: "userStory",
                        cond:{ $and: [
                                { $eq: [ "$$userStory.state", req.params.state ] },
                                { $and: [{ $ne: [ "$$userStory.estimatedTime", null ] },
                                        { $ne: [ "$$userStory.resource", null ] }]},
                            ] }
                    }
                }
            }
        }])
        .then((data) =>
        {
            if (data.length > 0)
            {
                userStory.populate(data[0]['userStories'], { path: 'item resource'},
                    function(error, userStories)
                    {
                        if (error)
                        {
                            res.status(500).send(error);
                        }
                        else
                        {
                            res.status(202).json(userStories);
                        }
                    });
                //res.status(202).json(data[0]['userStories']);
            }
            else
            {
                res.status(202).json(data);
            }
        })
        .catch(error =>
        {
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
        switch (req.params.state)
        {
            case 'Pending':
                user_Story.startDate = null;
                user_Story.duration = null;
                break;
            case 'In Progress':
                if (user_Story.startDate == null)
                {
                    user_Story.startDate = Date.now();
                }
                user_Story.duration = null;
                break;
            case 'To Verify':
                if (user_Story.startDate == null)
                {
                    user_Story.startDate = Date.now();
                }
                user_Story.duration = null;
                break;
            case 'Done':
                user_Story.duration = Math.round(moment.duration(Date.now() - user_Story.startDate, 'milliseconds').asMinutes());
                break;
        }
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