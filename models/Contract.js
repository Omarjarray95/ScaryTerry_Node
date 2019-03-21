var mongoose = require('mongoose');

var contractSchema = mongoose.Schema({
    _employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date_start: { type: Date },
    date_end: { type: Date },
    salary: { type: Number },
    _job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    _seniority: { type: mongoose.Schema.Types.ObjectId, ref: 'Seniority' },
});

module.exports = mongoose.model('Contract', contractSchema);