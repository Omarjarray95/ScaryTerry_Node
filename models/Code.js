var mongoose = require('mongoose');
const Skill = require('./Skill');

var CodeSchema = new mongoose.Schema({
    problem: { type: String, required: true },
    _tags: {
        type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Skill" }], validate: {
            validator:
                function (array) {
                    return array.length;
                },
            message: `tags should not be empty !`
        }
    },
    level: { type: Number, max: 10, min: 1, required: true },
    solution: { type: String, required: true }

});

module.exports = mongoose.model("Code", CodeSchema);