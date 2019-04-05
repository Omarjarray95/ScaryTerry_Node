var RecruitmentTest = require('../models/RecruitementTest');
var Quiz = require('../models/Quiz');
var Code = require('../models/Code');
var mongoose = require('mongoose');
var needle = require('needle');
var fs = require('fs');
var calculate_quiz = require('../utils/plugins/calculateQuiz');

// TODO: After setting up the recruitment generator depending on the level
// I have to make a level selection algorithm , that will calculate the 
// level of an employee depending on his achievments and knowledge and experience.

//TODO: we should only add and update the tests with an application of a ongoing
// job offer. 


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

var update = (req, res, next) => {
    let _id = req.params.id;
    let _code = req.body.code; // NOTE: This is the problem , not the code to validate
    let _quiz = req.body.quiz;


    RecruitmentTest.findById(_id)
        .then(data => {
            data._code = _code || data._code;
            data._quiz = _quiz || data._quiz;
            data.save(function (err, doc) {
                if (err) {
                    res.status(500).json(err);
                }
                res.status(200).json(doc);
            });
        }).catch(err => {
            res.status(500).json(err);
        });
}

var submitCode = (req, res, next) => {
    let code = req.file;
    let _id = req.params.id;
    let lang = req.body.lang;

    //TODO: here i have to make maybe a middleware that will check for the 
    // validation of this file 
    RecruitmentTest.findByIdAndUpdate(_id, { code: code.filename, lang })
        .then(test => {
            res.status(200).json(test);
        }).catch(err => {
            res.status(500).json(err);
        })
}

var generateTest = (req, res, next) => {
    //TODO: Charge this array with data from the database :D
    let skills = req.body.skills;
    let level = req.body.level;

    const tags = skills.map(skill => mongoose.Types.ObjectId(skill));
    const query = {
        $and: [{
            $nor: [{ tags: { $elemMatch: { $nin: tags } } }],
            $and: [{ level: { $gte: level - 1, $lte: level + 1 } }],

        }]
    };

    Quiz.aggregate()
        .match(query)
        .sample(2)
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

                            res.status(200).json({
                                _quiz: quizs,
                                _code: code
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


// api Judge0.com 
var testCode = (req, res, next) => {
    var recruitment_test = req.params.id;

    RecruitmentTest.findById(recruitment_test)
        .populate("_code")
        .exec()
        .then(async test => {
            if (!test) {
                res.status(500).json({ error: "The application test not found" });
            } else {
                runCode(test, res, function (result) {
                    res.status(200).json(result);
                });
            }

        }).catch(err => {
            res.status(500).json(err);
        });
}

var validateCode = (req, res, next) => {
    var recruitment_test = req.params.id;

    RecruitmentTest.findById(recruitment_test)
        .populate("_code")
        .exec()
        .then(async test => {
            if (!test) {
                res.status(500).json({ error: "The application test not found" });
            } else {
                console.log(test);
                runCode(test, res, function (result) {
                    console.log(result);

                    let validation = result.stdout === test._code.solution;
                    res.status(200).json({
                        correct: test._code.solution,
                        output: result.stdout,
                        answer: validation
                    });
                });
            }

        }).catch(err => {
            res.status(500).json(err);
        });
}

var submitQuiz = (req, res, next) => {
    let _id = req.params.id;
    let results = req.body.results;

    RecruitmentTest.findByIdAndUpdate(_id, {
        quiz_response: results
    }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });

}

var validateQuiz = (req, res, next) => {
    let _id = req.params.id;

    RecruitmentTest.findById(_id)
        .populate("_quiz")
        .exec()
        .then(data => {
            const quizs = data.quiz_response;
            if (quizs.length) {
                calculate_quiz(quizs)
                    .then(data => {
                        res.status(200).json(data);
                    }).catch(err => {
                        res.status(500).json(err);
                    });
            } else {
                res.status(500).json({ error: "Submit a response first" });
            }
        }).catch(err => {
            res.status(500).json(err);
        });
}

var runCode = (test, res, cb) => {
    const URL_SUBMISSION = "https://api.judge0.com/submissions/?base64_encoded=false&wait=true";
    const URL_LANGUAGE = "https://api.judge0.com/languages";
    //TODO: Read the language from the database

    const language = test.lang;
    //TODO: Read the file from the database
    const file = fs.readFile('public/testcodes/' + test.code, 'utf8', function (err, data) {
        if (err)
            res.status(500).json(err);
        const source_code = data;
        console.log(data);


        //NOTE: I can emit the call to get the language id , i already have them in my database 
        needle.get(URL_LANGUAGE, function (error, response, body) {
            if (error) {
                res.status(500).json(error);
            }
            else {
                if (!body.map(lang => lang.name).includes(language)) {
                    res.status(500).json({ error: "Language is invalid or we cannot run it on our server" });
                } else {
                    body.forEach((element, index) => {
                        if (element.name === language) {
                            console.log(language);
                            const lang = element.id;
                            var data = {
                                "source_code": source_code,
                                "language_id": lang,
                                "stdin": "world"
                            }

                            needle.post(URL_SUBMISSION, data, function (error, response, body) {
                                if (error)
                                    res.status(500).json(error);
                                //console.log(error);
                                if (body.stderr)
                                    // console.log("Error" + body.stderr);
                                    res.status(401).json(body.stderr);
                                else
                                    cb(body);
                            });
                        }
                    });
                }
            }
        })
    });
}

var get = (req, res, next) => {

}

module.exports = {
    add,
    getAll,
    get,
    submitCode,
    submitQuiz,
    generateTest,
    testCode,
    validateCode,
    validateQuiz,
    update
}