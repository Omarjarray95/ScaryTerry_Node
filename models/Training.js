var mongoose = require('mongoose');

var trainingSchema = mongoose.Schema({
    _trainees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String },
    date_start: { type: Date },
    date_end: { type: Date },
    _subject: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Training', trainingSchema);