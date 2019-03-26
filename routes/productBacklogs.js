var express = require('express');
var router = express.Router();
var project = require('../models/Project');
var productBacklog = require('../models/ProductBacklog');
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

/*router.get('/getproductbacklog/:id', function (req, res, next)
{

});*/

module.exports = router;