var express = require('express');
var Impediment = require('../models/Impediment');
var Solution = require('../models/ImpedimentSolution');

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










//Show all Impediments.
router.get('/react', function(req, res) {

    var findBY = {};
    var neededLabel;
    console.log('Getting all Impediments');
    console.log(req.query.user);
    if (req.query.labelHandle) {
        console.log(req.query.labelHandle)
        switch (req.query.labelHandle) {
            case 'frontend':
                neededLabel = 1;
                break;
            case 'backend':
                neededLabel = 2;
                break;
            case 'api':
                neededLabel = 3;
                break;
            case 'issue':
                neededLabel = 4;
                break;
            case 'mobile':
                neededLabel = 5;
                break;

        }
        findBY = {
            'labels': {
                "$in": [neededLabel]
            }
        };

    } else if (req.query.filterHandle) {
        console.log(req.query.filterHandle)
        if(req.query.filterHandle=="important")
        { 
            findBY = {
                'important_by': {
                    "$in": [req.query.user]
                }
            };
           
        }
    } else // folderHandle
    {
        findBY = {};
    }
    Impediment.find(findBY).populate({
        path: 'solution',
        populate: { path: 'added_by' }
    }).exec(function(err, impediments) {
        if (err) {
            res.send('error has occured');
        } else {
           // console.log(impediments);
            res.json(impediments.map(x => JSON.parse(JSON.stringify({
                id: x._id,
                title: x.name,
                notes: x.content,
                startDate: x.added_at,
                dueDate: x.added_at,
                completed: false,
                starred: false,
                important: x.important_by.some(function(i) {
                    return i.equals(req.query.user);
                }),
                deleted: false,
                labels: x.labels,
                solution:x.solution
            }))));
        }
    });

});





router.post('/restupdate', function(req, res) {

    Impediment.findOne({
            "_id": req.body.id
        }, function(error, imp) {
            if (req.body.important && (!imp.important_by.some(function(i) {
                    return i.equals(req.body.user);
                }))) {
                imp.important_by.push(req.body.user)
            }
            if (!req.body.important && (imp.important_by.some(function(i) {
                    return i.equals(req.body.user);
                }))) {
                imp.important_by.pull(req.body.user)
            }

            //console.log(imp.important_by + " and " + req.body.user);
            console.log(imp.important_by.some(function(i) {
                return i.equals(req.body.user);
            }));

            imp.save();
        })
        .then((data) => {
            res.set('Content-Type', 'application/json');
            res.status(202).json(req.body);
            //   console.log(data);
        })
        .catch(error => {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });

});

router.post('/restadd', function(req, res) {
    console.log(req.body);
    var newImpediment = new Impediment();
    newImpediment.content = req.body.notes;
    newImpediment.added_at = Date.now();
    newImpediment.added_by = req.body.user;
    newImpediment.name = req.body.title;
    newImpediment.labels = req.body.labels
    newImpediment.save(function(err, impediment) {
        if (err) {
            res.send('error saving impediment');
            console.log(err);
        } else {
            console.log(impediment);
            res.status(202).send(impediment);
        }
    });
});



router.post('/restanswer', function(req, res) {

    Impediment.findOne({
            "_id": req.body.imp
        }, function(error, imp) {
            var newSolution=new Solution();
            newSolution.content=req.body.answer;
            newSolution.added_by=req.body.user;
            newSolution.added_at=Date.now();
            newSolution.save(function(err,sol) {
                if (err) {
                    res.send('error saving solution');
                    console.log(err);
                } else {
                    imp.solution.push(sol.id);
                   // console.log(sol);
                    imp.save();
                  //  res.status(202).send(impediment);
                }
            });
        })
        .then((data) => {
            res.set('Content-Type', 'application/json');
            res.status(202).json(req.body);
            //   console.log(data);
        })
        .catch(error => {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });

});



//Show all Impediments another version.
router.get('/apireact', function(req, res) {

    var findBY = {};
    var neededLabel;
    console.log('Getting all Impediments');
    console.log(req.query.user);
    if (req.query.labelHandle) {
        console.log(req.query.labelHandle)
        switch (req.query.labelHandle) {
            case 'frontend':
                neededLabel = 1;
                break;
            case 'backend':
                neededLabel = 2;
                break;
            case 'api':
                neededLabel = 3;
                break;
            case 'issue':
                neededLabel = 4;
                break;
            case 'mobile':
                neededLabel = 5;
                break;

        }
        findBY = {
            'labels': {
                "$in": [neededLabel]
            }
        };

    } else if (req.query.filterHandle) {
        console.log(req.query.filterHandle)
        if(req.query.filterHandle=="important")
        { 
            findBY = {
                'important_by': {
                    "$in": [req.query.user]
                }
            };
           
        }
    } else // folderHandle
    {
        findBY = {};
    }
    var populateQuery = [{
        path: 'solution',
        populate: { path: 'added_by' }
    }
    , 'added_by'];
    Impediment.find(findBY).populate(populateQuery).exec(function(err, impediments) {
        if (err) {
            res.send('error has occured');
        } else {
           // console.log(impediments);
            res.json(impediments.map(x => JSON.parse(JSON.stringify({
                id: x._id,
                subject: x.name,
                message: x.content,
                time: x.added_at,
                user: x.added_by,
                completed: false,
                starred: false,
                important: x.important_by.some(function(i) {
                    return i.equals(req.query.user);
                }),
                deleted: false,
                labels: x.labels,
                hasAttachments: false,
                solution:x.solution,
                folder:0
            }))));
        }
    });

});

//show single impediment
router.get('/api/issueshub', function(req, res) {
    var populateQuery = [{
        path: 'solution',
        populate: { path: 'added_by' }
    }
    , 'added_by'];
    console.log(req.query);
    Impediment.findOne({
        _id: req.query.mailId
    }).populate(populateQuery).exec(function(err, impediment) {
        if (err) {
            res.send("Couldn't find impediment.");
        } else {
            console.log(impediment);
            //res.json(impediment);

            res.json( JSON.parse(JSON.stringify({
                id: impediment._id,
                subject: impediment.name,
                message: impediment.content,
                time: impediment.added_at,
                user: impediment.added_by,
                completed: false,
                starred: false,
                important: impediment.important_by.some(function(i) {
                    return i.equals(req.query.user);
                }),
                deleted: false,
                labels: impediment.labels,
                hasAttachments: false,
                solution:impediment.solution,
                folder:0
            })));




        }
    });
   // res.end(202)
});

