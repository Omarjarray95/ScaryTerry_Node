var express = require('express');
var router = express.Router();
var program = require('../models/Program');

router.post('/addprogram', function(req, res, next)
{
    var name = req.body.name;
    var description = req.body.description;

    program.create(
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

router.get('/getprograms', function(req, res, next)
{
    program.find({}).sort('name')
        .then((data) =>
        {
            res.set('Content-Type', 'application/json');
            res.status(202).json(data);
        })
        .catch((error) =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.post('/updateprogram/:id', function(req, res, next)
{
    var name = req.body.name;
    var description = req.body.description;

    program.findOne({"_id": req.params.id}, function (error, program)
    {
        program.name = name;
        program.description = description;
        program.save();
    })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The Program Has Been Updated Successfully !");

        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/deleteprogram/:id', function(req, res, next)
{
    program.deleteOne({"_id": req.params.id})
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The Program Has Been Deleted Successfully !");
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/getprogram/:id', function(req, res, next)
{
    program.findOne({"_id": req.params.id})
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

    program.findOne({name: name})
        .then((data) =>
        {
            if (data == null)
            {
                res.status(202).send("You Can Use This Name.");
            }
            else
            {
                res.status(200).send("There's Already A Program With The Given Name. Please Use Another Name.");
            }
        })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});

module.exports = router;