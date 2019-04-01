var express = require('express');
var router = express.Router();
var project = require('../models/Project');
var productBacklog = require('../models/ProductBacklog');
var item = require('../models/Item');
var mongoose = require('mongoose');

router.get('/addproductbacklog/:id', function (req, res, next)
{
    project.findOne({"_id":req.params.id}, function (error, project)
    {
        if (error)
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        }
        else
        {
            var PB = new productBacklog({_id: new mongoose.Types.ObjectId()});

            PB.save(function (error)
            {
                if (error)
                {
                    res.set('Content-Type', 'text/html');
                    res.status(500).send(error);
                }
                else
                {
                    project.productBacklog = PB._id;
                    project.save(function (error)
                    {
                        if (error)
                        {
                            res.set('Content-Type', 'text/html');
                            res.status(500).send(error);
                        }
                    });
                }
            });
        }
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

router.get('/getproductbacklog/:id', function (req, res, next)
{
    productBacklog.findOne({"_id": req.params.id}).populate('items')
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

router.get('/deleteproductbacklog/:id', function (req, res, next)
{
    productBacklog.findOne({"_id": req.params.id}, function (error, productBacklog)
    {
        if (error)
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        }
        else
        {
            var items = productBacklog.items;
            for (var id of items)
            {
                item.remove({"_id": id}, function (error)
                {
                    if (error)
                    {
                        res.set('Content-Type', 'text/html');
                        res.status(500).send(error);
                    }
                });
            }
            productBacklog.items = [];
            productBacklog.save(function (error)
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
        res.status(202).send("The Product Backlog Is Now Empty !");
    })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

module.exports = router;