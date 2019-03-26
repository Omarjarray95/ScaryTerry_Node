const mongoose = require ('mongoose');

var MeetingSchema = new mongoose.Schema({
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
    absence : [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false}],
    event_name: {
        type: String,
        required: false,
        enum: ["SP", "DM", "RETRO", "SR"]
    },
    Questions : [{type:mongoose.Schema.Types.ObjectId,ref:'MeetingQuestion',required:false}],
    Notes : [{type:mongoose.Schema.Types.ObjectId,ref:'MeetingNote',required:false}]

});

var meeting = mongoose.model('Meeting',MeetingSchema);

module.exports = meeting;
