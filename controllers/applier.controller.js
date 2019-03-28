var Applier = require('../models/Applier');

//TODO: Some updates will occur this controller due to some changes that will happen soon to the Model

var get = (req, res, next) => {

    Applier.find({}).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).send(err);
    });
}

var deleteById = (req, res, next) => {
    Applier.findById(req.params.id).
        then(data => {
            let applier = new Applier(data);
            applier.archive();
            res.status(200).json(data);
        }).
        catch(err => {
            res.status(500).send(err);
        });
}

var restore = (req, res, next) => {
    Applier.findOne({ _id: req.params.id, archivedAt: { $exists: true } }).
        then(data => {
            let applier = new Applier(data);
            applier.restore();
            res.status(200).json(data);
        }).
        catch(err => {
            res.status(500).send(err);
        });
}

var getArchived = (req, res, next) => {
    Applier.find({ archivedAt: { $exists: true } }).
        then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}
//DONE: Fix the null property . update a property when it's not null
var update = (req, res, next) => {
    let resume = req.body.resume;
    let skills = req.body.skills;
    Applier.findById(req.params.id).
        then(data => {
            data.resume = resume || data.resume;
            data.skills = skills || data.skills;
            data.save(function name(err, doc) {
                if (err)
                    res.status(500).json(data);
                res.status(200).json(data);
            });
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

var post = (req, res, next) => {
    let resume = req.body.resume;
    let skills = req.body.skills;

    Applier.create({
        resume,
        skills
    })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

module.exports = {
    get,
    post,
    deleteById,
    restore,
    getArchived,
    update
}