var mongoose = require('mongoose');
var Application = require('../models/Application');
const nodemailer = require("nodemailer");


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
module.exports = {
    add,
    get,
    getOne,
    getByApplier
}  