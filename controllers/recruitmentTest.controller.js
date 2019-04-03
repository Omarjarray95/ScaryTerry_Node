var RecruitmentTest = require('../models/RecruitementTest');
var Quiz = require('../models/Quiz');
var Code = require('../models/Code');
var mongoose = require('mongoose');
var needle = require('needle');
var fs = require('fs');

// TODO: After setting up the recruitment generator depending on the level
// I have to make a level selection algorithm , that will calculate the 
// level of an employee depending on his achievments and knowledge and experience.



var add = (req, res, next) => {

    //TODO: Complete all the other properties
    //TODO: attach this to the application => should know the application in advance 

    let _application = req.body._application;

    RecruitmentTest.create({
        _application,
    }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });

}

var getAll = (req, res, next) => {

    RecruitmentTest.find()
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}

var submitCode = (req, res, next) => {
    let code = req.file;
    let _id = req.params.id;
    //TODO: here i have to make maybe a middleware that will check for the 
    // validation of this file 

    if (!code) {
        const error = new Error("The File is invalid");
        res.status(500).json(code);
    }
    res.status(200).json(code);
}

var generateTest = (req, res, next) => {
    //TODO: Charge this array with data from the database :D

    const tags = ["5ca203b3f04712184de9e475", "5ca20383f04712184de9e474"]
        .map(skill => mongoose.Types.ObjectId(skill));

    Quiz.aggregate()
        .match({ $nor: [{ tags: { $elemMatch: { $nin: tags } } }] })
        .sample(2)
        .then(function (quizs) {

            Code.count()
                .then(count => {
                    Code.findOne({ $nor: [{ tags: { $elemMatch: { $nin: tags } } }] })
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

                            res.status(200).json(await new RecruitmentTest({
                                _quiz: quizs,
                                _code: code
                            }).populate("_quiz")
                                .populate("_code")
                                .execPopulate());
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


// api Judge0.com 
var testCode = (req, res, next) => {
    //const CLIENT_SECRET = "03859a3dd6e53b801e77fd50fb4e88d49a069aae";
    // const source = "printqeq 'Hello World'";
    const URL_SUBMISSION = "https://api.judge0.com/submissions/?base64_encoded=false&wait=true";
    const URL_LANGUAGE = "https://api.judge0.com/languages";
    //TODO: Read the language from the database 
    const language = "Go (1.9)";
    //TODO: Read the file from the database
    const file = fs.readFile('public/testcodes/code-2019-3-3.go', 'utf8', function (err, data) {
        if (err)
            console.log(err);
        const source_code = data;
        console.log(data);


        //TODO: I can emit the call to get the language id , i already have them in my database 
        needle.get(URL_LANGUAGE, function (error, response, body) {
            if (error) {
                console.log(error);
            }
            else {
                body.forEach(element => {
                    if (element.name === language) {

                        const lang = element.id;
                        var data = {
                            "source_code": source_code,
                            "language_id": lang,
                            "stdin": "world"
                        }

                        needle.post(URL_SUBMISSION, data, function (error, response, body) {
                            if (error)
                                console.log(error);
                            if (body.stderr)
                                console.log("Error" + body.stderr);
                            else
                                console.log(body.stdout);
                        });

                    }
                });
            }
        })
    });
}

testCode();
var get = (req, res, next) => {

}

module.exports = {
    add,
    getAll,
    get,
    submitCode,
    generateTest
}