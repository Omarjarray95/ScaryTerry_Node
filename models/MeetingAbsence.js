const mongoose = require ('mongoose');

var MeetingAbsenceSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    absent_at: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
        required: true
    },
    justified: {
        type: Boolean,
        required: true,
        default:false
    },
    why: {
        type: String,
        required: false
    }
});

var meetingnotecriteria = mongoose.model('MeetingAbsence',MeetingAbsenceSchema);

module.exports = meetingnotecriteria;
