const mongoose = require ('mongoose');

var DailyMeetingSchema = new mongoose.Schema({
    duration : {
        type : Number,
        required: true
    },
    time_start : {
        type : Date,
        required: true   
    },
    time_end : {
        type : Date,
        required: true
    },
    _meeting : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'   
    }
});
module.exports = mongoose.model('DailyMeeting',DailyMeetingSchema);