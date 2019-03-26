var express = require('express');
var router = express.Router();
var item = require('../models/Item');
var productBacklog = require('../models/ProductBacklog');
var mongoose = require('mongoose');

router.post('/additem/:id', function (req, res, next)
{
    var title = req.body.title;
    var description = req.body.description;
    var priority = req.body.priority;

    var I = new item({
        title: title,
        description: description,
        priority: priority
    });

    I.save(function (error)
    {
        if (error)
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        }

        productBacklog.findOne({"_id": req.params.id}, function (error, productBacklog)
        {
            productBacklog.items.push(I._id);
            productBacklog.save(function (error)
            {
                if (error)
                {
                    res.set('Content-Type', 'text/html');
                    res.status(500).send(error);
                }
            });
        }).then((data) =>
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
});

router.post('/checktitledescription', function (req, res, next)
{
    var title = req.body.title;
    var description = req.body.description;

    item.find({$or : [{'title': title}, {'name': description}]})
        .then((data) =>
        {
            if (data == null)
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

module.exports = router;