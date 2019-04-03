var mongoose = require('mongoose');

var QuizSchema = new mongoose.Schema({
    question: { type: String, required: true },
    correct: { type: String, required: true },
    wrong: [{ type: String, required: true }],
    level: { type: Number, max: 10, min: 1, required: true },
    tags: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Skill", required: true }],
});

module.exports = mongoose.model('Quiz', QuizSchema);