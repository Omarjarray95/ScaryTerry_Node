const mongoose = require ('mongoose');
const meeting = require('./Meeting');
var DailyMeetingSchema = new mongoose.Schema({
    duration : {
        type : number,
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
        ref: meeting   
    }
});
mongoose.model('DailyMeeting',DailyMeetingSchema);