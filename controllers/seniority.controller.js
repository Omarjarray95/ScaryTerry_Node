var Seniority = require('../models/Seniority');

var nextSeniority = (req, res, next) => {
    let seniorityId = req.params.id;
    Seniority.findById(seniorityId)
        .then(data => {
            Seniority.nextSeniority(data)
                .then(data => {
                    res.status(200).json(data);
                }).catch(err => {
                    res.status(500).json(err);
                });
        }).catch(err => {
            res.status(500).json(err);
        });
}

var addSeniority = (req, res, next) => {
    let seniority = req.body.seniority;
    let level = req.body.level;

    Seniority.create({
        seniority,
        level
    }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });
}

module.exports = {
    nextSeniority,
    addSeniority,
}