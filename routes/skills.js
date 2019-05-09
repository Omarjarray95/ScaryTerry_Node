var express = require('express');
var router = express.Router();
var skill = require('../models/Skill');
var Projects = require('../models/Project');
var user = require('../models/User');

router.post('/addskill', function(req, res, next)
{
    var name = req.body.name;
    var description = req.body.description;

    skill.create(
        {
            name: name,
            description: description
        })
        .then((data) =>
        {
            res.status(202).send("Saved !");
        })
        .catch(error =>
        {
            res.status(500).send(error);
        });
});

router.get('/getskills', function(req, res, next)
{
    skill.find({}).sort('name')
        .then((skills) =>
        {            
            res.set('Content-Type', 'application/json');
            res.status(202).json(data);

            res.status(202).json(skills);
        })
        .catch((error) =>
        {
            res.status(500).send(error);
        });
});

router.post('/updateskill/:id', function(req, res, next)
{
    var name = req.body.name;
    var description = req.body.description;

    skill.findOne({"_id": req.params.id}, function (error, skill)
    {
        skill.name = name;
        skill.description = description;
        skill.save();
    })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The Skill Has Been Updated Successfully !");

        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/deleteskill/:id', function(req, res, next)
{
    skill.deleteOne({"_id": req.params.id})
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The Skill Has Been Deleted Successfully !");
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});


router.get('/getskill/:id', function(req, res, next)
{
    skill.findOne({"_id": req.params.id})
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

    skill.findOne({name: name})
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
                res.status(200).send("There's Already A Skill With The Given Name. Please Use Another Name.");
            }
        })
        .catch(error =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

router.get('/details',function(req,res) {
   var id = req.params.id;
   
    skill.aggregate([{
        $lookup:{
            from:"projects",
            localField:"_id",
            foreignField:"skills",
            as:"projects"
        }
    },{
        $lookup:{
            from:"joboffers",
            localField:"_id",
            foreignField:"requirements",
            as:"joboffers"
        }
    },
    {
        $project:{
                _id:1,
                name:"$name",
                description:"$description",
                projects:{$size:"$projects",},
                offers:{$size:"$joboffers",},
            }
    }
    ]).then(data=>{
        res.status(200).json(data);

    }).catch(err=>{
        res.status(500).json(err);
    })

//    Projects.count({skills:{$in : id}})
//     .then(data=>{
//         res.status(200).json({
//             projects:data,
//         });
//     }).catch(err=>{
//         res.status(500).json(err);
//     })
});

router.get('/details',function (req,res) {
    
})

module.exports = router;