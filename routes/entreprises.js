var express = require('express');
var router = express.Router();
var entreprise = require('../models/Entreprise');
var field = require('../models/Field');
var mongoose = require('mongoose');

router.post('/addentreprise', function(req, res, next)
{
    var name = req.body.name;
    var domain = req.body.field;
    var location = req.body.location;
    var description = req.body.description;

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
        });
        domain = F._id;
    }

    entreprise.create(
        {
            name: name,
            field: domain,
            location: location,
            description: description
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

router.get('/getentreprises', function(req, res, next)
{
    entreprise.find({}).populate('field')
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

router.post('/updateentreprise/:id', function(req, res, next)
{
    var name = req.body.name;
    var domain = req.body.field;
    var location = req.body.location;
    var description = req.body.description;

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
        });
        domain = F._id;
    }

    entreprise.findOne({"_id":req.params.id}, function (error, E)
    {
        E.name = name;
        E.field = domain;
        E.location = location;
        E.description = description;
        E.save();
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

router.get('/deleteentreprise/:id', function(req, res, next)
{
    entreprise.deleteOne({ "_id": req.params.id })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The Entreprise Was Deleted Successfully !");
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/getentreprise/:id', function(req, res, next)
{
   entreprise.findOne({"_id": req.params.id})
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

router.post('/checkname', function(req, res, next)
{
    var name = req.body.name;

    entreprise.findOne({name: name})
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

module.exports = router;