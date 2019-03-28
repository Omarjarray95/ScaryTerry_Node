var mongoose = require('mongoose');
var Application = require('../models/Application');


// function:add Application
// condition: _applier already exists
var add = (req, res, next) => {
    var app = new Application();
    var score = req.body.score;
    var _applier = req.body._applier_id;
    var _job = req.body._job_id;


    Application.create({
        _applier,
        date_posted: Date.now(),
        _job,
        score,
    }).
        then(data => {
            res.status(200).json(data);
        }).
        catch(err => {
            res.status(500).json(err);
        });

}

var get = (req, res, next) => {
    Application.find({}).
        populate('_applier').
        populate('_job').
        then(data => {
            res.json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}

var getOne = (req, res, next) => {
    Application.findById(req.params.id).
        populate('_applier').
        populate('_job').
        then(data => {
            res.json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}

var getByApplier = (req, res, next) => {
    Application.find({ _applier: req.params.id }).
        populate('_applier').
        populate('_job').
        then(data => {
            res.json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}
module.exports = {
    add,
    get,
    getOne,
    getByApplier
}  