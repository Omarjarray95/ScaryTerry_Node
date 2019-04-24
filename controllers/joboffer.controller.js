var JobOffer = require('../models/JobOffer');
var pdfreader = require('pdfreader');
var _ = require('lodash');
var path = require('path');
var generateCSV = require('../utils/generate_csv');

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


var filterResume = async (resume, keywords, cb) => {
    var rows = {}; // indexed by y-position
    // TODO: Dynamic keywords from the database , whether by the choice of someone
    // or generate the filter from the requirements from the job offer
    function printRows(cb) {
        Object.keys(rows) // => array of y-positions (type: float)
            .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
            .forEach((y) => cb((rows[y] || []).join('')));
    }

    await new pdfreader.PdfReader().parseFileItems('./public/resumes/' + resume, async function (err, item) {
        if (!item || item.page) {
            // end of file, or page
            await printRows(async function (row) {
                var index = 0;
                // DONE: use the match functions and regex for a better search
                for (const keyword of keywords) {
                    const reg = new RegExp(keyword, "gi");
                    if (row.match(reg)) {
                        keywords.splice(index, 1);
                    }
                    index++;
                };
            });
            //console.log("rows ", rows);
            if (Object.keys(rows).length === 0 && rows.constructor === Object) {
                cb(null, keywords);
            }
            //console.log('PAGE:', item.page);
            rows = {}; // clear rows for next page

        }
        else if (item.text) {
            // accumulate text items into rows object, per line
            (rows[item.y] = rows[item.y] || []).push(item.text);
        }
        if (err) {
            cb(err, null)
        }
    });

}

var filterResumes = (req, res, next) => {
    let _id = req.params.id;

    JobOffer.findById(_id)
        .populate("requirements")
        .populate("_applications")
        .exec()
        .then(data => {
            const keywords = data.requirements.map(key => key.name);
            const applications = data._applications
                .map(application => {
                    return {
                        applier: application._applier,
                        resume: application.resume
                    }
                });
            let result = []
            applications.forEach((app, index) => {
                filterResume(app.resume, JSON.parse(JSON.stringify(keywords)), function (err, data) {
                    if (err) {
                        res.status(500).json(err);
                    }
                    result.push({
                        matches: keywords.filter(x => !data.includes(x)),
                        requirements: keywords,
                        application: app,
                        allMatch: _.isEqual(_.sortBy([keywords]), _.sortBy(data))
                    });
                    if (index === applications.length - 1) {
                        res.status(200).json(result);
                    }
                    console.log(result);
                });
            });
        }).catch(err => {
            res.status(500).json(err);
        });
}

var downloadCSV = (req,res)=>{
    // fix the data and the fields properties
    JobOffer.find()
        .populate("_job")
        .populate("requirements")
        .then(data=>{
            const fields = ["requirements","_job","description"];
            generateCSV(fields,data,function (file) {
                var fileLocation = path.join(file);               
                // res.status(500).json(data);
                console.log(fileLocation);
                res.download(fileLocation);  
            });
        }).catch(err=>{
            res.status(500).json(err);
        })
    
}

module.exports = {
    add,
    get,
    getApplications,
    filterResumes,
    downloadCSV
}