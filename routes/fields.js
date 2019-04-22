var express = require('express');
var router = express.Router();
var field = require('../models/Field');
var mongoose = require('mongoose');

router.post('/addfield', function(req, res, next)
{
    var name = req.body.name;
    var description = req.body.description;

    field.create(
        {
            name: name,
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

router.get('/getfields', function(req, res, next)
{
    field.find({}).sort('name')
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

router.post('/updatefield/:id', function(req, res, next)
{
    var name = req.body.name;
    var description = req.body.description;

    field.findOne({"_id": req.params.id}, function (error, field)
    {
        field.name = name;
        field.description = description;
        field.save();
    })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The Field Has Been Updated Successfully !");

        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/deletefield/:id', function(req, res, next)
{
    field.deleteOne({"_id": req.params.id})
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The Field Has Been Deleted Successfully !");
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/getfield/:id', function(req, res, next)
{
    field.findOne({"_id": req.params.id})
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

    field.findOne({name: name})
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
                res.status(200).send("There's Already A Field With The Given Name. Please Use Another Name" +
                    " Or Choose The Field You Gave Its Name From The List Above.");
            }
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

module.exports = router;