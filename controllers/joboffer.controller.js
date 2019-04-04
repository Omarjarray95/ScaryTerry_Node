var JobOffer = require('../models/JobOffer');

var add = (req, res, next) => {
    var requirements = req.body.requirements;
    var description = req.body.description;
    var _job = req.body._job;

    JobOffer.create({
        requirements,
        description,
        _job
    }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });
}

var get = (req, res, next) => {
    JobOffer.find()
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}

var getApplications = (req, res, next) => {
    var _offer = req.params.offer;

    JobOffer.findById(_offer)
        .then(data => {
            data.populate("_applications")
                .execPopulate()
                .then(data => {
                    res.status(200).json(data._applications);
                }).catch(err => {
                    res.status(500).json(err);
                })
        }).catch(err => {
            res.status(500).json(err);
        });
}

module.exports = {
    add,
    get,
    getApplications
}