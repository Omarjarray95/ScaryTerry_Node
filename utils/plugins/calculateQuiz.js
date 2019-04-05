var Quiz = require('../../models/Quiz');

var calculate = async (results) => {
    let score = [];
    for (let result of results) {
        await Quiz.findById(result.id)
            .then(async data => {
                score.push({
                    answer: result.response,
                    correct: data.correct,
                    validate: data.correct === result.response,
                });
            }).catch(err => {
                res.status(500).json(err);
            });
    }
    return score;
}

module.exports = calculate;