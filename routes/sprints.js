var express = require('express');
var router = express.Router();
var project = require('../models/Project');
var sprint = require('../models/Sprint');
var increment = require('../models/Increment');
var mongoose = require('mongoose');

router.post('/addsprint/:id', function (req, res, next)
{
    var goal = req.body.goal;
    var description = req.body.description;
    var startDate = req.body.startDate;
    var duration = req.body.duration;

    var I = new increment({_id: new mongoose.Types.ObjectId()});

    I.save(function (error)
    {
        if (error)
        {
            res.status(500).send(error);
        }
    });

    var S = new sprint(
        {
            _id: new mongoose.Types.ObjectId(),
            goal: goal,
            description: description,
            startDate: startDate,
            duration: duration,
            supplement: I._id
        });

    S.save(function (error)
    {
        if (error)
        {
            res.status(500).send(error);
        }
    });

    project.findOne({"_id": req.params.id}).populate('program field entreprise skills productOwner scrumMaster developmentTeam' +
        ' sprints')
        .populate({
            path: 'productBacklog',
            populate: { path: 'items', options: { sort: 'priority'} }
        })
        .exec(function (error, p)
    {
        if (error)
        {
            res.status(500).send(error);
        }
        else
        {
            p.sprints.push(S._id);
            p.save(function (error)
            {
                if (error)
                {
                    res.status(500).send(error);
                }
                else
                {
                    project.populate(p, {
                            path: 'sprints',
                            options: { sort: 'startDate'}
                        },
                        function(error, project)
                        {
                            if (error)
                            {
                                res.status(500).send(error);
                            }
                            else
                            {
                                res.status(202).json(project);
                            }
                        });
                }
            });
        }
    });
});

router.get('/getprojectsprints/:id', function (req, res, next)
{
    project.findOne({"_id":req.params.id}).populate('sprints')
        .then((project) =>
        {
            res.set('Content-Type', 'application/json');
            res.status(202).json(project.sprints);
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.post('/updatesprint/:id', function (req, res, next)
{
    var description = req.body.description;
    var startDate = req.body.startDate;
    var duration = req.body.duration;

    sprint.findOne({"_id": req.params.id}, function (error, project)
    {
        if (error)
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        }
        else
        {
            project.description = description;
            project.startDate = startDate;
            project.duration = duration;
            project.save(function ()
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
        res.status(202).send("The Sprint Information Has Been Updated Successfully !");
    })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/getsprint/:id', function(req, res, next)
{
    sprint.findOne({"_id": req.params.id})
        .then((data) =>
        {
            res.set('Content-Type', 'application/json');
            res.status(202).json(data);
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/deletesprint/:id/:project', function(req, res, next)
{
    sprint.deleteOne({ "_id": req.params.id })
        .then(() =>
        {
            project.findOne({"_id":req.params.project}).populate('program field entreprise skills productOwner scrumMaster ' +
                'developmentTeam' + ' sprints')
                .populate({
                    path: 'productBacklog',
                    populate: { path: 'items', options: { sort: 'priority'} }
                })
                .exec(
                function (error, p)
                {
                    if (error)
                    {
                        res.status(500).send(error);
                    }
                    else
                    {
                        //p.sprints.splice(p.sprints.indexOf(req.params.id), 1);
                        p.save(function (error)
                        {
                            if (error)
                            {
                                res.status(500).send(error);
                            }
                            else
                            {
                                project.populate(p, {
                                    path: 'sprints',
                                    options: { sort: 'startDate'}
                                },
                                    function(error, project)
                                    {
                                        if (error)
                                        {
                                            res.status(500).send(error);
                                        }
                                        else
                                        {
                                            res.status(202).json(project);
                                        }
                                    });
                            }
                        });
                    }
                });
        })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});

module.exports = router;