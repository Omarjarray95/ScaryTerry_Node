var express = require('express');
var router = express.Router();
var user = require('../models/User');
var entreprise = require('../models/Entreprise');
var field = require('../models/Field');
var skill = require('../models/Skill');
var level = require('../models/Level');
var mongoose = require('mongoose');

router.post('/adduser', function(req, res, next)
{
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var company = req.body.entreprise;

    var name = req.body.name;
    var domain = req.body.field;

    var fieldName = req.body.fieldName;

    if (company == null)
    {
        if (domain == null)
        {
            var F = new field({
                _id: new mongoose.Types.ObjectId(),
                name: fieldName
            });
            F.save(function(error)
            {
                if (error)
                {
                    res.set('Content-Type', 'text/html');
                    res.status(500).send(error);
                }
            });
            domain = F._id;
        }
        const E = new entreprise({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            field: domain
        });
        E.save(function(error)
        {
            if (error)
            {
                res.set('Content-Type', 'text/html');
                res.status(500).send(error);
            }
            else
            {
                var U = new user({
                    username: username.toLowerCase(),
                    password: password,
                    role: role,
                    firstName: firstName,
                    lastName: lastName,
                    entreprise: E._id
                });

                U.save(function(error)
                {
                    if (error)
                    {
                        res.set('Content-Type', 'text/html');
                        res.status(500).send(error);
                    }
                    else
                    {
                        res.set('Content-Type', 'application/json');
                        res.status(202).json(U);
                    }
                });
            }
        });
    }
    else
    {
        user.create(
            {

                username: username.toLowerCase(),
                password: password,
                role: role,
                firstName: firstName,
                lastName: lastName,
                entreprise: company

            }).then((data) =>
        {
            res.set('Content-Type', 'application/json');
            res.status(202).json(data);

        }).catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
    }
});

router.get('/getusers', function(req, res, next)
{
    user.find({})
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

router.post('/updateuser/:id', function(req, res, next)
{
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var company = req.body.entreprise;

    var name = req.body.name;
    var domain = req.body.field;

    var fieldName = req.body.fieldName;

    if (company == null)
    {
        if (domain == null)
        {
            var F = new field({
                _id: new mongoose.Types.ObjectId(),
                name: fieldName
            });
            F.save(function(error)
            {
                if (error)
                {
                    res.set('Content-Type', 'text/html');
                    res.status(500).send(error);
                }
            });
            domain = F._id;
        }
        const E = new entreprise({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            field: domain,
        });
        E.save(function(error)
        {
            if (error)
            {
                res.set('Content-Type', 'text/html');
                res.status(500).send(error);
            }
            else
            {
                user.update({"_id": req.params.id},
                    {
                        username: username,
                        password: password,
                        role: role,
                        firstName: firstName,
                        lastName: lastName,
                        entreprise: E._id,

                    }).then(() =>
                {
                    res.set('Content-Type', 'text/html');
                    res.status(202).send("The User Was Updated Successfully");

                }).catch(error =>
                {
                    res.set('Content-Type', 'text/html');
                    res.status(500).send(error);
                });
            }
        });
    }
    else
    {
        user.update({"_id": req.params.id},
            {
                username: username,
                password: password,
                role: role,
                firstName: firstName,
                lastName: lastName,
                entreprise: company,

            }).then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The User Was Updated Successfully");

        }).catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
    }
});

router.post('/login', function(req, res, next)
{
    var username = req.body.username;
    var password = req.body.password;
    user.findOne({username: username.toLowerCase()})
        .then((user) =>
        {
            if (user != null)
            {
                if (user.password === password)
                {
                    user.lastLogin = Date.now();
                    user.save(function (error)
                    {
                        if (error)
                        {
                            res.set('Content-Type', 'text/html');
                            res.status(500).send(error);
                        }
                        else
                        {
                            res.set('Content-Type', 'application/json');
                            res.status(202).send(user);
                        }
                    });
                }
                else
                {
                    res.set('Content-Type', 'text/html');
                    res.status(200).send("Incorrect Password.");
                }
            }
            else
            {
                res.set('Content-Type', 'text/html');
                res.status(200).send("No User Found With The Sent Credentials, Please Try Again.");
            }
        })
        .catch(error =>
        {
          res.set('Content-Type', 'text/html');
          res.status(500).send(error);
        });
});

router.get('/getroles', function(req, res, next)
{
    var roles = user.schema.path('role').enumValues;
    res.set('Content-Type', 'application/json');
    res.status(202).json(roles);
});

router.post('/checkusername', function(req, res, next)
{
    var username = req.body.username;

    user.findOne({username: username.toLowerCase()})
        .then((data) =>
        {
            if (data == null)
            {
                res.set('Content-Type', 'text/html');
                res.status(202).send("You Can Use This Username.");
            }
            else
            {
                res.set('Content-Type', 'text/html');
                res.status(200).send("This Username Is Not Available. Please Try With Another Username.");
            }
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/getuser/:id', function(req, res, next)
{
    user.findOne({"_id": req.params.id})
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

router.get('/deleteuser/:id', function(req, res, next)
{
    user.deleteOne({ "_id": req.params.id })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The User Was Deleted Successfully !");
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.post('/affectskill/:id', function (req, res, next)
{
    var competence = req.body.skill;
    var seniority = req.body.seniority;
    var years = req.body.years;

    var name = req.body.name;

    if (competence == null)
    {
        var S = new skill(
            {
                _id: new mongoose.Types.ObjectId(),
                name: name
            });

        S.save(function (error)
        {
            if (error)
            {
                res.set('Content-Type', 'text/html');
                res.status(500).send(error);
            }
        });

        skill = S._id;
    }

    user.findOne({"_id": req.params.id}, function (error, user)
    {
        if (error)
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        }

        var L = new level(
            {
                _id: new mongoose.Types.ObjectId(),
                skill: skill,
                seniority: seniority,
                years: years
            });

        L.save(function (error)
        {
            if (error)
            {
                res.set('Content-Type', 'text/html');
                res.status(500).send(error);
            }

            user.skills.push(L._id);
            user.save(function (error)
            {
                if (error)
                {
                    res.set('Content-Type', 'text/html');
                    res.status(500).send(error);
                }
            });
        })
    })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The Skill Was Affected Successfully To The Resource !");
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

module.exports = router;
