const mongoose = require('mongoose');

var ScheduleJobSchema = new mongoose.Schema({
    at: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true,
        enum: ['EVENT_START','EVENT_END','ATTENDANCE_CHECK']
    },
    related_event: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
        required: false
    }]

});

var meeting = mongoose.model('ScheduleJob', ScheduleJobSchema);

module.exports = meeting;