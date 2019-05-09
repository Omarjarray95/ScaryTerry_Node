var express = require('express');
var router = express.Router();
var user = require('../models/User');
var entreprise = require('../models/Entreprise');
var field = require('../models/Field');
var program = require('../models/Program');
var project = require('../models/Project');
var productBacklog = require('../models/ProductBacklog');
var mongoose = require('mongoose');
var Recommendations = require('../utils/algorithms/Technical_Recommandations');

router.post('/addproject', function (req, res, next)
{
    var prg = req.body.program;
    var title = req.body.title;
    var description = req.body.description;
    var domain = req.body.field;
    var company = req.body.entreprise;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var duration = req.body.duration;
    var scrumMaster = req.body.scrumMaster;

    var programName = req.body.programName;
    var fieldName = req.body.fieldName;
    var entrepriseName = req.body.entrepriseName;
    var fieldName1 = req.body.fieldName1;

    var fieldName2 = req.body.fieldName2;

    if (company == null)
    {
        if (fieldName1 == null)
        {
            var F = new field({_id: new mongoose.Types.ObjectId(), name: fieldName2});

            F.save(function (error)
            {
                if (error)
                {
                    res.status(500).send(error);
                }
            });

            fieldName1 = F._id;
            if (fieldName === fieldName2)
            {
                domain = fieldName1;
            }
        }

        var E = new entreprise({_id: new mongoose.Types.ObjectId(),
            name: entrepriseName,
            field: fieldName1});

        E.save(function (error)
        {
            if (error)
            {
                res.status(500).send(error);
            }
        });

        company = E._id;
    }

    if (domain == null)
    {
        var F1 = new field({_id: new mongoose.Types.ObjectId(), name: fieldName});

        F1.save(function (error)
        {
            if (error)
            {
                res.status(500).send(error);
            }
        });

        domain = F1._id;
    }

    if (prg == null)
    {
        if (programName != null)
        {
            var P = new program({_id: new mongoose.Types.ObjectId(), name: programName});

            P.save(function (error)
            {
                if (error)
                {
                    res.status(500).send(error);
                }
            });

            prg = P._id;
        }
    }

    var PB = new productBacklog({_id: new mongoose.Types.ObjectId()});

    PB.save(function (error)
    {
        if (error)
        {
            res.status(500).send(error);
        }
    });

    var PR = new project(
        {
            creationDate: Date.now(),
            program: prg,
            title: title,
            description: description,
            field: domain,
            entreprise: company,
            startDate: startDate,
            endDate: endDate,
            duration: duration,
            scrumMaster: scrumMaster,
            productBacklog: PB._id
        });

    PR.save(function(error)
    {
        if (error)
        {
            res.status(500).send(error);
        }
        else
        {
            res.status(202).send(PR.title + " Was Created Successfully, You Are Now Its Scrum Master");
        }
    });
});

router.get('/getprojects', function (req, res, next)
{
    project.find({}).populate('entreprise program').sort({creationDate: -1})
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

router.post('/updateproject/:id', function (req, res, next)
{
    var prg = req.body.program;
    var title = req.body.title;
    var description = req.body.description;
    var domain = req.body.field;
    var company = req.body.entreprise;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var duration = req.body.duration;

    var programName = req.body.programName;
    var fieldName = req.body.fieldName;
    var entrepriseName = req.body.entrepriseName;
    var fieldName1 = req.body.fieldName1;

    var fieldName2 = req.body.fieldName2;

    if (company == null)
    {
        if (fieldName1 == null)
        {
            var F = new field({_id: new mongoose.Types.ObjectId(), name: fieldName2});

            F.save(function (error)
            {
                if (error)
                {
                    res.set('Content-Type', 'text/html');
                    res.status(500).send(error);
                }
            });

            fieldName1 = F._id;
        }

        var E = new entreprise({_id: new mongoose.Types.ObjectId(),
            name: entrepriseName,
            field: fieldName1});

        E.save(function (error)
        {
            if (error)
            {
                res.set('Content-Type', 'text/html');
                res.status(500).send(error);
            }
        });

        company = E._id;
    }

    if (domain == null)
    {
        var F1 = new field({_id: new mongoose.Types.ObjectId(), name: fieldName});

        F1.save(function (error)
        {
            if (error)
            {
                res.set('Content-Type', 'text/html');
                res.status(500).send(error);
            }
        });

        domain = F1._id;
    }

    if (prg == null)
    {
        if (programName != null)
        {
            var P = new program({_id: new mongoose.Types.ObjectId(), name: programName});

            P.save(function (error)
            {
                if (error)
                {
                    res.set('Content-Type', 'text/html');
                    res.status(500).send(error);
                }
            });

            prg = P._id;
        }
    }

    project.findOne({"_id": req.params.id}, function (error, project)
    {
        if (error)
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        }
        else
        {
            project.program = prg;
            project.title = title;
            project.description = description;
            project.field = domain;
            project.entreprise = company;
            project.startDate = startDate;
            project.endDate = endDate;
            project.duration = duration;
            project.save();
        }
    }).then(() =>
    {
        res.set('Content-Type', 'text/html');
        res.status(202).send("The Project Information Have Been Updated Successfully !");

    })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/deleteproject/:id', function(req, res, next)
{
    project.deleteOne({ "_id": req.params.id })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The Project Was Deleted Successfully !");
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/getproject/:id', function(req, res, next)
{
    project.findOne({"_id": req.params.id}).populate('program field entreprise skills productOwner scrumMaster developmentTeam')
        .populate({
            path: 'sprints',
            options: { sort: 'startDate'}
        })
        .populate({
            path: 'productBacklog',
            populate: { path: 'items', options: { sort: 'priority'} }
        })
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

router.post('/checktitle', function(req, res, next)
{
    var title = req.body.title;

    project.findOne({title: title})
        .then((data) =>
        {
            if (data == null)
            {
                res.set('Content-Type', 'text/html');
                res.status(202).send("You Can Use This Title.");
            }
            else
            {
                res.set('Content-Type', 'text/html');
                res.status(200).send("This Title Is Not Available. Please Try With Another Username.");
            }
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.post('/affectskills/:id', function (req, res, next)
{
    var skills = req.body;

    project.findOne({"_id":req.params.id}, function (error, project)
    {
        if (error)
        {
            res.status(500).send(error);
        }
        else
        {
            project.skills = skills;
            project.save(function (error)
            {
                if (error)
                {
                    res.status(500).send(error);
                }
            });
        }
    }).then(() =>
    {
        res.status(202).send("The Skills Were Affected Successfully To The Project !");
    })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});

router.post('/affectteam/:id', function (req, res, next)
{
    var productOwner = req.body.productOwner;
    var scrumMaster = req.body.scrumMaster;
    var developmentTeam = req.body.developmentTeam;

    project.findOne({"_id":req.params.id}).populate('program field entreprise skills productOwner scrumMaster developmentTeam' +
        ' sprints').exec(
            function (error, p)
            {
                if (error)
                {
                    res.status(500).send(error);
                }
                else
                {
                    p.scrumMaster = scrumMaster;
                    p.productOwner = productOwner;
                    p.developmentTeam = developmentTeam;
                    p.save(function (error)
                    {
                        if (error)
                        {
                            res.status(500).send(error);
                        }
                        else
                        {
                            project.populate(p, {path: "scrumMaster productOwner developmentTeam"},
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

router.get('/generaterecommendations/:id', function (req, res, next)
{
    user.find({role: "Employee"}).populate({
        path: 'skills',
        populate: { path: 'skill' }
    })
        .then((employees) =>
        {
            if (employees.length === 0)
            {
                res.set('Content-Type', 'text/html');
                res.status(200).send("There Are No Employees To Be Suggested !");
            }
            else
            {
                project.findOne({"_id": req.params.id}).populate('skills')
                    .then((prjct) =>
                    {
                        var query = project.find(
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
                                    ]}).populate('productOwner scrumMaster developmentTeam');

                            query.then((projects) =>
                            {
                                var suggestions = new Recommendations(employees, projects, prjct);
                                var scores = suggestions.check_skills();
                                if (prjct.program != null)
                                {
                                    project.find({"_id": {$ne:prjct._id},program:prjct.program})
                                        .populate('productOwner scrumMaster developmentTeam')
                                        .then((projects) =>
                                        {
                                            scores = suggestions.check_program_entreprise(projects, scores);
                                            project.find({"_id": {$ne:prjct._id},entreprise:prjct.entreprise})
                                                .populate('productOwner scrumMaster developmentTeam')
                                                .then((projects) =>
                                                {
                                                    scores = suggestions.check_program_entreprise(projects, scores);
                                                    project.find({"_id": {$ne:prjct._id},field:prjct.field})
                                                        .populate('productOwner scrumMaster developmentTeam')
                                                        .then((projects) =>
                                                        {
                                                            scores = suggestions.check_field(projects, scores);
                                                            scores = suggestions.generate_suggestions(scores);
                                                            res.set('Content-Type', 'application/json');
                                                            res.status(202).json(scores);
                                                        })
                                                        .catch((error) =>
                                                        {
                                                            res.set('Content-Type', 'text/html');
                                                            res.status(500).send(error);
                                                        });
                                                })
                                                .catch((error) =>
                                                {
                                                    res.set('Content-Type', 'text/html');
                                                    res.status(500).send(error);
                                                });
                                        })
                                        .catch((error) =>
                                        {
                                            res.set('Content-Type', 'text/html');
                                            res.status(500).send(error);
                                        });
                                }
                                else
                                {
                                    project.find({"_id": {$ne:prjct._id},entreprise:prjct.entreprise})
                                        .populate('productOwner scrumMaster developmentTeam')
                                        .then((projects) =>
                                        {
                                            scores = suggestions.check_program_entreprise(projects, scores);
                                            project.find({"_id": {$ne:prjct._id},field:prjct.field})
                                                .populate('productOwner scrumMaster developmentTeam')
                                                .then((projects) =>
                                                {
                                                    scores = suggestions.check_field(projects, scores);
                                                    scores = suggestions.generate_suggestions(scores);
                                                    res.set('Content-Type', 'application/json');
                                                    res.status(202).json(scores);
                                                })
                                                .catch((error) =>
                                                {
                                                    res.set('Content-Type', 'text/html');
                                                    res.status(500).send(error);
                                                });
                                        })
                                        .catch((error) =>
                                        {
                                            res.set('Content-Type', 'text/html');
                                            res.status(500).send(error);
                                        });
                                }
                            })
                            .catch((error) =>
                            {
                                res.set('Content-Type', 'text/html');
                                res.status(500).send(error);
                            });
                    })
                    .catch((error) =>
                    {
                        res.set('Content-Type', 'text/html');
                        res.status(500).send(error);
                    });
            }
        })
        .catch((error) =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/getsprintproject/:id', function (req, res, next)
{
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

module.exports = router;