var mongoose = require('mongoose');
var Application = require('../models/Application');
const nodemailer = require("nodemailer");
var multer = require('multer');
var Applier = require('../models/Applier');
var JobOffer = require('../models/JobOffer');
var pdfreader = require('pdfreader');

// function:add Application
// DONE: condition: _applier already exists
var add = async (req, res, next) => {
    var _applier = req.body._applier;

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/resumes');
        },
        filename: function (req, file, cb) {
            // NOTE: the file will be stored as "firstName_lastName_DateOfSubmission"
            Applier.findById(_applier)
                .then(data => {
                    const ext = file.originalname.split('.').pop();

                    // DONE: Check if the file is pdf , the problem is that i cannot access to the response parameter 
                    // TODO: get a unique name for the file to store
                    if (ext !== "pdf") {
                        res.status(500).json({ "error": "The resume should be pdf" });
                    } else {
                        const now = new Date(Date.now());
                        cb(null, data.first_name + "_" + data.last_name + '_' + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + '.' + ext);
                    }
                }).catch(err => {
                    res.status(500).json(err);

                })
        }
    });

    var upload = multer({ storage: storage }).single('resume');

    upload(req, res, function (err) {
        // DONE: this is a file 
        var resume = req.file;
        var _offer = req.params.offer;

        Application.create({
            _applier,
            resume: resume.filename,
        }).then(data => {
            //Add the application to the right offer
            JobOffer.findById(_offer)
                .then(offer => {
                    offer._applications.push(data);
                    offer.save()
                        .then(offer => {
                            res.status(200).json(data);
                        }).catch(err => {
                            res.status(500).json(err);
                        });
                }).catch(err => {
                    res.status(500).json(err);
                });
        }).catch(err => {
            res.status(500).json(err);
        });


    });
}

var get = (req, res, next) => {
    //TODO: send the file of the resume
    //TODO: in case we deleted the score property , we have to calculate it then send it 
    Application.find({}).
        populate('_applier').
        then(async data => {
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

//DONE: This works successfully
var testMail = async (req) => {
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
        to: "saidi_mahdi@hotmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
            '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>', // html body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            req.status(500).json(error);
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

var filterResume = () => {
    var rows = {}; // indexed by y-position
    // TODO: Dynamic keywords from the database , whether by the choice of someone
    // or generate the filter from the requirements from the job offer 

    var keywords = ["Java", "Django"];

    function printRows(cb) {
        Object.keys(rows) // => array of y-positions (type: float)
            .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
            .forEach((y) => cb((rows[y] || []).join('')));
    }

    new pdfreader.PdfReader().parseFileItems('./public/resumes/Elmahdi_Saidi_2019-3-3.pdf', function (err, item) {
        if (!item || item.page) {
            // end of file, or page
            printRows(function (row) {
                // DONE: use the match functions and regex for a better search
                keywords.forEach(keyword => {
                    const reg = new RegExp(keyword, "gi");
                    if (row.match(reg)) {
                        console.log("find it " + keyword);
                    }
                });

            });
            //console.log('PAGE:', item.page);
            rows = {}; // clear rows for next page
        }
        else if (item.text) {
            // accumulate text items into rows object, per line
            (rows[item.y] = rows[item.y] || []).push(item.text);
        }
    });
}

filterResume();

module.exports = {
    add,
    get,
    getOne,
    getByApplier
}  