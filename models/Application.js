var mongoose = require('mongoose');

var applicationSchema = mongoose.Schema({
    _applier: { type: mongoose.Schema.Types.ObjectId, ref: 'Applier' },
    resume: { type: String, required: true },
    date_posted: { type: Date, default: Date.now() },
    score: { type: String },// TODO: delete this property , useless
});

module.exports = mongoose.model('Application', applicationSchema);