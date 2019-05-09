var JobOffer = require('../models/JobOffer');
var pdfreader = require('pdfreader');
var Quiz = require('../models/Quiz');
var Code = require('../models/Code');
var Test = require('../models/RecruitementTest');
var Application = require('../models/Application');
var Job = require('../models/Job');
var generateCSV = require('../utils/generate_csv');
var _ = require('lodash');
var path = require('path');

const nodemailer = require("nodemailer");

var _ = require('lodash');

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
    var query = {};
    if (req.query.labelHandle) {
        query = {requirements:{$in:req.query.labelHandle}}
    }
    JobOffer.find(query)
        .populate("requirements")
        .populate("_applications")
        .populate("_job")
        .exec()
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}

var getOne = (req, res, next) => {
    const _id = req.params.id;
    JobOffer.findById(_id)
        .populate("requirements")
        .populate("_applications")
        .populate("_job")
        .exec()
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

var complete = (req,res)=>{
    const id = req.params.id;
    JobOffer.findById(id)
        .then(data=>{
            data.completed = !data.completed;
            data.save()
                .then(data=>{
                    const job = data._job;
                    data._applications.forEach(application=>{
                        console.log(application);

                        generateTest(data,application,res);
                       
                        
                    });
                    res.status(200).json(data);
                }).catch(err=>{
                    res.status(500).json(err);
                });
        }).catch(err=>{
            res.status(500).json(err);
        });
}

//DONE: This works successfully
var testMail = async (job,test,app,res) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let account = await nodemailer.createTestAccount();

    let user = account.user;
    let pass = account.pass;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: true,
        port: 465, // true for 465, false for other ports
        auth: {
            type: "OAuth2", //Authentication type
            user: "saidi3mahdi@gmail.com", //For example, xyz@gmail.com
            clientId: "1039818664848-ef0b6ai0rar7u4je1qbfrf1pntja27bd.apps.googleusercontent.com",
            clientSecret: "PyF_nl3n8Eh_6RPcTXXHIZVD",
            refreshToken: "1/sqLn0aMliEX9kAcsrE5lH2IfXJhrqEajV2tSNhsOE7w"

        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'Recruitment Department saidi3mahdi@gmail.com', // sender address
        to: app._applier.email, // list of receivers data._applier.email
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        // job!==null ? job.title : 
        html: '<p><b>Hello</b> We Are Happy To Inform you that you are Selected to pass the test exam for </p><b>'+'The Job '+'</b>'+
            '<p>Here you will find a link to the test Exam </p><b>http://localhost:3000/test/'+test._id+'</b> <br> Thank you '+app._applier.email, // html body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            res.status(500).json(error);
            return process.exit(1);
        }
        console.log('Message sent successfully!');
        console.log(nodemailer.getTestMessageUrl(info));

        // only needed when using pooled connections
        transporter.close();
    });

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

generateTest = (offer,application_id,res)=>{
    let tags = offer.requirements;
    let level = 5;
    // const tags = skills.map(skill => mongoose.Types.ObjectId(skill));

    const query = {
        $and: [{
            $nor: [{ tags: { $elemMatch: { $nin: tags } } }],
            $and: [{ level: { $gte: level - 5, $lte: level + 5 } }],
        }]
    };

    Quiz.aggregate()
        .match(query)
        .sample(3)
        .then(function (quizs) {
            Code.count()
                .then(count => {
                    Code.findOne(query)
                        .skip(Math.round(Math.random(count))).then(async code => {

                            // RecruitmentTest.create({
                            //     _quiz: quizs,
                            //     _code: code
                            // }).then(test => {
                            //     res.status(200).json(test);
                            // }).catch(err => {
                            //     res.status(500).json(err);
                            // });
                            console.log(code);

                            Test.create({
                                _application:application_id,
                                _quiz: quizs,
                                _code: code
                            }).then(test => {
                                Job.findById(offer._job)
                                    .then(job=>
                                            Application.findById(application_id)
                                                .populate('_applier')
                                                .exec()
                                                .then(app=>testMail(job,test,app,res))
                                                .catch(err=>console.log(err))
                                    ).catch(err => {
                                        res.status(500).json(err);
                                    });
                                }).catch(err => {
                                    res.status(500).json(err);
                                });
                        }).catch(err => {
                            res.status(500).json(err);
                        });
                }).catch(err => {
                    res.status(500).json(err);
                });

            // res.status(200).json(data);
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
            const pathoutput = "./public/csvdocuments/joboffers/";
            generateCSV(fields,data,pathoutput,function (file) {
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
    getOne,
    get,
    getApplications,
    filterResumes,
    complete,
    downloadCSV
}