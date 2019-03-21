var mongoose = require('mongoose');

var skillSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String }
});

module.exports = mongoose.model('Skill', skillSchema);