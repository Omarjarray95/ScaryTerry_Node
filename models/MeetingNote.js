const mongoose = require('mongoose');

var MeetingNoteSchema = new mongoose.Schema({
    made_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attributed_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    note: {
        type: Number,
        required: true,
        enum: [-1, +1]
    },
    during_event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'
    },
    remark: {
        type: String,
        required: false
    },
    criteria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MeetingNoteCriteria',
        required: true
    }

});

var meetingnote = mongoose.model('MeetingNote', MeetingNoteSchema);

module.exports = meetingnote;