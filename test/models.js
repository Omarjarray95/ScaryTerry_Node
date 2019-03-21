var users = require('../models/User');
var Application = require('../models/Application');
var Applier = require('../models/Applier');
var Job = require('../models/Job');

// add appliaction TEST
var addApplicationTest = function (req, res, next) {
    let _applier = new Applier({ resume: "Good" });
    // save the applier , then the job , then the application
    // in case the job or applier is already exists , we can automatically assign its _id
    // to the application  
    _applier.save(function (err) {
        if (err) return console.log(err);
        let _job = new Job({
            title: "Manager",
            description: "Best of them all",
        });
        _job.save(function (err) {

            if (err) return console.log(err);

            var app = new Application({
                _applier: _applier._id,
                date_posted: Date.now(),
                _job: _job._id,
                score: "20",
            })
            app.save(function (err) {
                if (err) return console.log(err);
                console.log("Saved \n" + app);
            });
        });
    });


    next();
}

var showApplicationTest = function (req, res, next) {
    Application.find({}).
        populate('_applier').
        populate('_job').
        exec(function (err, app) {
            app.forEach(app => {
                console.log(app);
            });
        })
    next();
}
module.exports = showApplicationTest;