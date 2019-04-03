var express = require('express');
var Impediment = require('../models/Impediment');
var router = express.Router();



//Show all Impediments.
router.get('/', function(req, res) {
    console.log('Getting all Impediments');
    Impediment.find({}).exec(function(err, impediments) {
        if (err) {
            res.send('error has occured');
        } else {
            console.log(impediments);
            res.json(impediments);
        }
    });
});
//show single impediment
router.get('/find/:id', function(req, res) {
    console.log('getting one impediment');
    Impediment.findOne({
        _id: req.params.id
    }).exec(function(err, impediment) {
        if (err) {
            res.send("Couldn't find impediment.");
        } else {
            console.log(impediment);
            res.json(impediment);
        }
    });
});
//ADD NEW IMPEDIMENT.
router.post('/', function(req, res) {
    var newImpediment = new Impediment();
    newImpediment.content = req.body.content;
    newImpediment.added_at = Date.now();
    newImpediment.name = req.body.name;
    newImpediment.importance = req.body.importance;
    newImpediment.save(function(err, impediment) {
        if (err) {
            res.send('error saving impediment');
            console.log(err);
        } else {
            console.log(impediment);
            res.send(impediment);
        }
    });
});
//UPDATE IMPEDIMENT
router.put('/:id', function(req, res, next) {
    var name = req.body.name;
    var content = req.body.content;
    var importance = req.body.importance;

    Impediment.findOne({
            "_id": req.params.id
        }, function(error, impediment) {
            impediment.name = name;
            impediment.content = content;
            impediment.importance = importance;
            impediment.save();
        })
        .then((data) => {
            res.set('Content-Type', 'application/json');
            res.status(202).json(data);

        })
        .catch(error => {
            res.set('Content-Type', 'text/html');
            console.log(error);
            res.status(500).send(error);
        });
});


//DELETE IMPEDIMENT
router.delete('/:id', function(req, res) {
    Impediment.findByIdAndRemove({
        _id: req.params.id
    }, function(err, impediment) {
        if (err) {
            res.send('error deleting impediment');
        } else {
            console.log(impediment);
            res.send(impediment);
        }
    });
});


//ANSWER IMPEDIMENT
router.put('/solution/:id', function(req, res, next) {
    var solution = req.body.solution;
    Impediment.findOne({
            "_id": req.params.id
        }, async function(error, impediment) {

            impediment.solution.push({
                content: solution,
                added_at: Date.now()
            });
            impediment.save();
        })
        .then((data) => {
            res.set('Content-Type', 'application/json');
            res.status(202).send("Answer added successfully");

        })
        .catch(error => {
            console.log(error);
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});



//Search for similar problem.
router.get('/search/:searchquery', function(req, res) {
    var term = req.params.searchquery;
    console.log(term);
    Impediment.find({
            $text: {
                $search: term
            },
        }, {
            score: {
                $meta: "textScore"
            }
        }).sort({
            score: {
                $meta: "textScore"
            }
        })
        .then(imps => res.json(imps[0]))
        .catch(e => console.log(e));
});
module.exports = router;