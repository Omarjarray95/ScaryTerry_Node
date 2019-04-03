var mongoose = require('mongoose');

var applicationSchema = mongoose.Schema({
    _applier: { type: mongoose.Schema.Types.ObjectId, ref: 'Applier' },
    resume: { type: String, required: true },
    date_posted: { type: Date },
    score: { type: String },
});

module.exports = mongoose.model('Application', applicationSchema);