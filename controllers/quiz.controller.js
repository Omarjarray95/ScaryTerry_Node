var Quiz = require('../models/Quiz');

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
    let score = 0;
    if (!results.length)
        res.status(500).json("There's no result to display");

    const calculate = async () => {
        let score = 0;
        for (let result of results) {
            await Quiz.findById(result.id)
                .then(async data => {
                    if (data.correct === result.response) {
                        console.log(data.correct);
                        score++;
                    }

                }).catch(err => {
                    res.status(500).json(err);
                });
        }
        return score;
    }

    calculate().then(result => {
        res.status(200).json(result);
    });
}

module.exports = {
    add,
    getAll,
    getById,
    validate
}