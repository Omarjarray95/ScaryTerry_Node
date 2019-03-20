var express = require('express');
var router = express.Router();
var user = require('../models/User');
var entreprise = require('../models/Entreprise');
var field = require('../models/Field');
var mongoose = require('mongoose');

router.post('/login', function(req, res, next)
{
    var username = req.body.username;
    var password = req.body.password;
    user.findOne({username: username.toLowerCase()})
        .then((data) =>
        {
            if (data != null)
            {
                if (data.password === password)
                {
                    res.set('Content-Type', 'application/json');
                    res.status(202).send(data);
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

router.get('/getfields', function(req, res, next)
{
    field.find({})
        .then((data) =>
        {
            res.status(202).json(data);
        })
        .catch((error) =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
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

router.post('/checkentreprisename', function(req, res, next)
{
    var name = req.body.name;

    entreprise.findOne({name: name.toLowerCase()})
        .then((data) =>
        {
            if (data == null)
            {
                res.set('Content-Type', 'text/html');
                res.status(202).send("You Can Use This Name.");
            }
            else
            {
                res.set('Content-Type', 'text/html');
                res.status(200).send("There's Already An Entreprise With The Given Name. Please Use Another Name" +
                    " Or Choose The Enterprise You Gave Its Name From The List Above.");
            }
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

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
    var location = req.body.location;

    var fieldName = req.body.fieldName;

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

           //domain = F._id;
        });
    }

    if (company == null)
    {
        if (domain == null)
        {
            domain = F._id;
        }
        const E = new entreprise({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            field: domain,
            location: location
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
                       res.status(202).send(U);
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
            res.set('Content-Type', 'text/html');
            res.status(202).send(data);
        }).catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
    }
});

module.exports = router;
