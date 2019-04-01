var express = require('express');
var router = express.Router();
var user = require('../models/User');
var sprint = require('../models/Sprint');
var userStory = require('../models/UserStory');
var mongoose = require('mongoose');

router.post('/adduserstory/:id', function (req, res, next)
{
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

router.post('/updateuserstory/:id', function(req, res, next)
{
    var title = req.body.title;
    var description = req.body.description;
    var priority = req.body.priority;
    var estimatedTime = req.body.estimatedTime;

    userStory.findOne({"_id": req.params.id}, function (error, userStory)
    {
        userStory.title = title;
        userStory.description = description;
        userStory.priority = priority;
        userStory.estimatedTime = estimatedTime;
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

module.exports = router;