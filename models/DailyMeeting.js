const mongoose = require ('mongoose');

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
        ref: 'Meeting'   
    }
});
mongoose.model('DailyMeeting',DailyMeetingSchema);