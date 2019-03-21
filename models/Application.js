var mongoose = require('mongoose');

var applicationSchema = mongoose.Schema({
    _applier: { type: mongoose.Schema.Types.ObjectId, ref: 'Applier' },
    date_posted: { type: Date },
    _job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    score: { type: String },
});

module.exports = mongoose.model('Application', applicationSchema);