var mongoose = require('mongoose');

var skillSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: false},
        level: {type: String, required: false,
        enum: ["Not Applicable", "Fundamental", "Novice", "Intermediate", "Advanced", "Expert"]},
        years: {type: Number, required: false}
    });

var skill = mongoose.model('Skill', skillSchema);

module.exports = skill;