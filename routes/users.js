var express = require('express');
var router = express.Router();
var user = require('../models/User');
var entreprise = require('../models/Entreprise');
var field = require('../models/Field');
var skill = require('../models/Skill');
var level = require('../models/Level');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var multer  = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, 'C:\\Users\\User\\Documents\\ScaryTerry_Fuse\\public\\images');
    },
    filename: function (req, file, cb)
    {
        cb(null, file.originalname );
    }
});

var upload = multer({ storage: storage }).single('file');

router.post('/adduser', function (req, res, next)
{
    var username = req.body.username;
    //var password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
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
            F.save(function (error)
            {
                if (error)
                {
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
        E.save(function (error)
        {
            if (error)
            {
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

                U.save(function (error)
                {
                    if (error)
                    {
                        res.status(500).send(error);
                    }
                    else
                    {
                        res.status(202).send(firstName + "'s Account Was Created Successfully !");
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

            }).then(() =>
            {
                res.status(202).json(firstName + "'s Account Was Created Successfully !");

            }).catch(error =>
            {
                res.status(500).send(error);
            });
    }
});

router.get('/getusers', function (req, res, next)
{
    user.find({}).sort('firstName').populate('entreprise')
        .populate({path: 'skills', populate: {path: 'skill'}})
        .then((data) =>
        {
            res.status(202).json(data);
        })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});

router.get('/getemployees', function (req, res, next)
{
    user.find({role: "Employee"})
        .then((data) =>
        {
            res.status(202).json(data);
        })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});

router.post('/updateuser/:id', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var company = req.body.entreprise;

    var name = req.body.name;
    var domain = req.body.field;

    var fieldName = req.body.fieldName;

    if (company == null) {
        if (domain == null) {
            var F = new field({
                _id: new mongoose.Types.ObjectId(),
                name: fieldName
            });
            F.save(function (error) {
                if (error) {
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
        E.save(function (error) {
            if (error) {
                res.set('Content-Type', 'text/html');
                res.status(500).send(error);
            }
            else {
                user.update({ "_id": req.params.id },
                    {
                        username: username,
                        password: password,
                        role: role,
                        firstName: firstName,
                        lastName: lastName,
                        entreprise: E._id,

                    }).then(() => {
                        res.set('Content-Type', 'text/html');
                        res.status(202).send("The User Was Updated Successfully");

                    }).catch(error => {
                        res.set('Content-Type', 'text/html');
                        res.status(500).send(error);
                    });
            }
        });
    }
    else {
        user.update({ "_id": req.params.id },
            {
                username: username,
                password: password,
                role: role,
                firstName: firstName,
                lastName: lastName,
                entreprise: company,

            }).then(() => {
                res.set('Content-Type', 'text/html');
                res.status(202).send("The User Was Updated Successfully");

            }).catch(error => {
                res.set('Content-Type', 'text/html');
                res.status(500).send(error);
            });
    }
});

router.get('/getuser/:id', function (req, res, next) {
    user.findOne({ "_id": req.params.id })
        .then((data) => {
            res.set('Content-Type', 'application/json');
            res.status(202).json(data);
        })
        .catch(error => {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.post('/login', function (req, res, next)
{
    var username = req.body.username;
    var password = req.body.password;
    user.findOne({ username: username.toLowerCase() })
        .then((user) =>
        {
            if (user != null)
            {
                //if (bcrypt.compareSync(password, user.password))
                if (password === user.password)
                {
                    user.lastLogin = Date.now();
                    user.save(function (error)
                    {
                        if (error)
                        {
                            res.status(500).send(error);
                        }
                        else
                        {
                            var token = jwt.sign({username: user.username}, 'shhhhh');
                            var data = '{ "id":' + '"' + user._id + '"' + ', "username":' + '"' + user.username + '"' + ', "role":' + '"' + user.role + '"' +
                                ', "firstName":' + '"' + user.firstName + '"' + ', "lastName":' + '"' + user.lastName + '"' +
                                ', "token":' + '"' + token + '"' + ' }';
                            res.status(202).send(JSON.parse(data));
                        }
                    });
                }
                else
                {
                    res.status(200).send("Incorrect Password.");
                }
            }
            else
            {
                res.status(200).send("No User Found With The Sent Credentials, Please Try Again.");
            }
        })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});

router.get('/getroles', function (req, res, next) {
    var roles = user.schema.path('role').enumValues;
    res.set('Content-Type', 'application/json');
    res.status(202).json(roles);
});

router.get('/getfields', function (req, res, next) {
    field.find({})
        .then((data) => {
            res.status(202).json(data);
        })
        .catch((error) => {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.post('/checkusername', function (req, res, next)
{
    var username = req.body.username;

    user.findOne({ username: username.toLowerCase() })
        .then((data) =>
        {
            if (data == null)
            {
                res.status(202).send("You Can Use This Username.");
            }
            else
                {
                res.status(200).send("This Username Is Not Available. Please Try With Another Username.");
            }
        })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});

router.get('/deleteuser/:id', function (req, res, next) {
    user.deleteOne({ "_id": req.params.id })
        .then(() => {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The User Was Deleted Successfully !");
        }).catch(error => {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.post('/checkentreprisename', function (req, res, next) {
    var name = req.body.name;

    entreprise.findOne({ name: name.toLowerCase() })
        .then((data) => {
            if (data == null) {
                res.set('Content-Type', 'text/html');
                res.status(202).send("You Can Use This Name.");
            }
            else {
                res.set('Content-Type', 'text/html');
                res.status(200).send("There's Already An Entreprise With The Given Name. Please Use Another Name" +
                    " Or Choose The Enterprise You Gave Its Name From The List Above.");
            }

        })
        .catch(error => {
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

    if (competence == null) {
        var S = new skill(
            {
                _id: new mongoose.Types.ObjectId(),
                name: name
            });

        S.save(function (error) {
            if (error)
            {
                res.status(500).send(error);
            }

        });

        competence = S._id;
    }

    user.findOne({ "_id": req.params.id }, function (error, user)
    {
        if (error)
        {
            res.status(500).send(error);
        }

        var L = new level(
            {
                _id: new mongoose.Types.ObjectId(),
                skill: competence,
                seniority: seniority,
                years: years
            });

        L.save(function (error)
        {
            if (error)
            {
                res.status(500).send(error);
            }

            user.skills.push(L._id);
            user.save(function (error)
            {
                if (error)
                {
                    res.status(500).send(error);
                }
                else
                {
                    res.status(202).send("The Skill Was Affected Successfully To The Resource !");
                }
            });
        })
    });

});

router.get('/deleteskill/:id', function (req, res, next)
{
    level.deleteOne({ "_id": req.params.id })
        .then(() =>
        {
            res.status(202).send("The Skill Was Deleted Successfully !");
        })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});

router.post('/uploadimage/:id', function (req, res, next)
{
    upload(req, res, function (error)
    {
        if (error)
        {
            res.status(500).json(error);
        }
        else
        {
            var ext = '';
            switch (req.file.mimetype)
            {
                case 'image/png':
                {
                    ext = '.png';
                    break;
                }
                case 'image/jpeg':
                {
                    ext = '.jpeg';
                    break;
                }
                case 'image/bmp':
                {
                    ext = '.bmp';
                    break;
                }
            }
            var fileName = 'C:\\Users\\User\\Documents\\ScaryTerry_Fuse\\public\\images\\' + req.body.name + ext;
            fs.rename('C:\\Users\\User\\Documents\\ScaryTerry_Fuse\\public\\images\\' + req.file.originalname,
                fileName, function (err)
                {
                    if (err)
                    {
                        res.status(500).json(err);
                    }
                    else
                    {
                        user.findOne({"_id": req.params.id}, function (e, user)
                        {
                            user.avatar = req.body.name + ext;
                            user.save(function (error)
                            {
                                if (error)
                                {
                                    res.status(500).send(error);
                                }
                                else
                                {
                                    res.status(202).send("Image Uploaded !");
                                }
                            })
                        })
                    }
                });
            //res.status(200).send(req.file);
        }
    });

});

router.get('/deleteimage/:id', function (req, res, next)
{
    user.findOne({"_id": req.params.id}, function (e, user)
    {
        user.avatar = null;
        user.save(function (error)
        {
            if (error)
            {
                res.status(500).send(error);
            }
            else
            {
                res.status(202).send("Image Deleted !");
            }
        });
    });
});

module.exports = router;
