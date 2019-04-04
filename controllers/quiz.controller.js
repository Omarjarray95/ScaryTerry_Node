var Quiz = require('../models/Quiz');
var calculate = require('../utils/plugins/calculateQuiz');


var add = (req, res, next) => {
    var correct = req.body.correct;
    var wrong = req.body.wrong;
    var tags = req.body.tags;
    var question = req.body.question;
    var level = req.body.level;

    Quiz.create({
        question,
        correct,
        wrong,
        tags,
        level
    }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });

}

var getById = (req, res, next) => {
    var _id = req.params.id;
    Quiz.findById(_id)
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}

var getAll = (req, res, next) => {
    Quiz.find({})
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}

var validate = (req, res, next) => {
    let results = req.body.results;
    if (!results.length)
        res.status(500).json("There's no result to display");


    //TODO: Better Handling of the error occuring in the calculate function
    calculate(results).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
}


var checkQuiz = (quiz, ) => {

}

module.exports = {
    add,
    getAll,
    getById,
    validate,
    calculate
}