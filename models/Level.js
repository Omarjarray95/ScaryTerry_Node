var mongoose = require('mongoose');

var levelSchema = mongoose.Schema(
    {
        skill: {type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true},
        seniority: {type: String, required: false,
            enum: ["Not Applicable", "Fundamental", "Novice", "Intermediate", "Advanced", "Expert"]},
        years: {type: Number, required: false}
    });

var level = mongoose.model('Level', levelSchema);

module.exports = level;