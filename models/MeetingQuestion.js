const mongoose = require('mongoose');

var MeetingQuestionSchema = new mongoose.Schema({
    made_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Question: {
        type: String,
        required: true
    },
    Answer: {
        type: String,
        required: false
    },
    remark: {
        type: String,
        required: false
    }

});

var meetingquestion = mongoose.model('MeetingQuestion', MeetingQuestionSchema);

module.exports = meetingquestion;