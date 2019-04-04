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
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let linkedIn = req.body.linkedIn;
    //let skills = req.body.skills;

    Applier.findById(req.params.id).
        then(data => {
            data.first_name = first_name || data.first_name;
            data.last_name = last_name || data.last_name;
            data.email = email || data.email;
            data.linkedIn_profile = linkedIn || data.linkedIn_profile;
            data.save(function name(err, doc) {
                if (err)
                    res.status(500).json(data);
                res.status(200).json(doc);
            });
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

var post = (req, res, next) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let linkedIn = req.body.linkedIn;

    Applier.create({
        first_name,
        last_name,
        email,
        linkedIn_profile: linkedIn,
    }).then(data => {
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