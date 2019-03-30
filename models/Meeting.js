const mongoose = require('mongoose');

var MeetingSchema = new mongoose.Schema({
    time_start: {
        type: Date,
        required: true
    },
    time_end: {
        type: Date,
        required: true
    },
    absence: [{
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
    }]

});

var meeting = mongoose.model('Meeting', MeetingSchema);

module.exports = meeting;