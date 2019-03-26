var mongoose = require('mongoose');

var skillSchema = mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        description: {type: String, required: false}
    });

var skill = mongoose.model('Skill', skillSchema);

module.exports = skill;