var express = require('express');
var router = express.Router();
var item = require('../models/Item');
var productBacklog = require('../models/ProductBacklog');

router.post('/additem/:id', function (req, res, next)
{
    var title = req.body.title;
    var description = req.body.description;
    var priority = req.body.priority;
    var category = req.body.category;

    var I = new item({
        title: title,
        description: description,
        priority: priority,
        category: category
    });

    I.save(function (error)
    {
        if (error)
        {
            res.status(500).send(error);
        }

        productBacklog.findOne({"_id": req.params.id}, function (error, pB)
        {
            pB.items.push(I._id);
            pB.save(function (error)
            {
                if (error)
                {
                    res.status(500).send(error);
                }
                else
                {
                    productBacklog.populate(pB, {path: "items", options: { sort: { 'priority': -1 } }},
                        function(error, productBacklog)
                        {
                            if (error)
                            {
                                res.status(500).send(error);
                            }
                            else
                            {
                                res.status(202).json(productBacklog);
                            }
                        });
                }
            });
        });
    });
});

router.post('/updateitem/:id', function(req, res, next)
{
    var title = req.body.title;
    var description = req.body.description;
    var priority = req.body.priority;

    item.findOne({"_id": req.params.id}, function (error, item)
    {
        item.title = title;
        item.description = description;
        item.priority = priority;
        item.save();
    })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The Item Has Been Updated Successfully !");

        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/deleteitem/:id/:productbacklog', function(req, res, next)
{
    item.deleteOne({"_id": req.params.id})
        .then(() =>
        {
            productBacklog.findOne({"_id":req.params.productbacklog}).populate('items').exec(
                function (error, pB)
                {
                    if (error)
                    {
                        res.status(500).send(error);
                    }
                    else
                    {
                        //p.sprints.splice(p.sprints.indexOf(req.params.id), 1);
                        pB.save(function (error)
                        {
                            if (error)
                            {
                                res.status(500).send(error);
                            }
                            else
                            {
                                productBacklog.populate(pB, {path: "items", options: { sort: { 'priority': -1 } }},
                                    function(error, productBacklog)
                                    {
                                        if (error)
                                        {
                                            res.status(500).send(error);
                                        }
                                        else
                                        {
                                            res.status(202).json(productBacklog);
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

router.post('/checktitledescription', function (req, res, next)
{
    var title = req.body.title;
    var description = req.body.description;

    item.find({$or : [{title: title}, {description: description}]})
        .then((data) =>
        {
            if (data.length === 0)
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

/*router.post('/checkpriority/:id', function (req, res, next)
{
    var priority = req.body.priority;

    productBacklog.findOne({"_id": req.params.id})
        .then((productBacklog) =>
        {
            if (priority > productBacklog.scale.maximum || priority < productBacklog.scale.minimum)
            {
                res.set('Content-Type', 'text/html');
                res.status(200).send(false);
            }
            else
            {
                res.set('Content-Type', 'text/html');
                res.status(202).send(true);
            }
        })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});*/

module.exports = router;