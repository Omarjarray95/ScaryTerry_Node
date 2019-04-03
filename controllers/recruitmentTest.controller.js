var RecruitmentTest = require('../models/RecruitementTest');
var Quiz = require('../models/Quiz');
var Code = require('../models/Code');
var mongoose = require('mongoose');
var needle = require('needle');

// TODO: After setting up the recruitment generator depending on the level
// I have to make a level selection algorithm , that will calculate the 
// level of an employee depending on his achievments and knowledge and experience.



var add = (req, res, next) => {

    //TODO: Complete all the other properties
    //TODO: attach this to the application => should know the application in advance 

    let _applier = req.body._applier;

    RecruitmentTest.create({
        _applier,
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

var testCode = (req, res, next) => {
    const CLIENT_SECRET = "03859a3dd6e53b801e77fd50fb4e88d49a069aae";
    const source = "print 'Hello World'";

    var data = {

        'client_secret': CLIENT_SECRET,
        'async': 0,
        'source': source,
        'lang': "PYTHON",
        'time_limit': 5,
        'memory_limit': 262144,
    }

    needle.post('https://api.hackerearth.com/v3/code/run/', data, function (error, response, body) {
        if (error)
            console.log(err);
        console.log(body);
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