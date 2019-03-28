var mongoose = require('mongoose');
var Applier = require('../models/Applier');

var add = function (req, res, next) {
    var _applier_id = req.body._applier_id;
    var _applier = req.body._applier;

    if (_applier_id === undefined) {
        //res.status(500).send({ err: _applier + " is undefined" });
        if (_applier === undefined) {
            res.status(500).json({ err: "an applier is required for the application" });
        }
        Applier.create(_applier).then(data => {
            console.log(data);
            req.body._applier_id = data._id;
            next();

        }).catch(err => {
            res.status(500).json(err);
        });
    }
    else {

        //TODO: Cast to object id
        Applier.findById(_applier_id).then(data => {
            console.log("data: " + data);
            if (data === null) {
                res.status(500).json({ err: "Applier Does not exist" });
            } else {
                next();
            }
        }).catch(err => {
            console.log("Hello");
            res.status(500).json({ err: err });
        });
    }
}

module.exports = {
    add,
}