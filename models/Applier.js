var mongoose = require('mongoose');

var applierSchema = mongoose.Schema({
    resume: { type: String },
    _skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    _applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
});

module.exports = mongoose.model('Applier', applierSchema);