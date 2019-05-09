const mongoose = require('mongoose');

var MeetingSchema = new mongoose.Schema({
    time_start: {
        type: Date,
        required: false
    },
    time_end: {
        type: Date,
        required: false
    },
    real_time_start: {
        type: Date,
        required:false
    },
    real_time_end: {
        type: Date,
        required: false
    },
    attendance: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    name: {
        type: String,
        required: true,
        enum: ["SP", "DM", "RETRO", "SR"]
    },
    Questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MeetingQuestion',
        required: false
    }],
    Notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MeetingNote',
        required: false
    }],
    Sprint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sprint',
        required: true
    },
    Impediment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Impediment',
        required: false
    }]

});

var meeting = mongoose.model('Meeting', MeetingSchema);

module.exports = meeting;

