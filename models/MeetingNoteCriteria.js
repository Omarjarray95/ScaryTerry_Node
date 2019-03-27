const mongoose = require ('mongoose');

var MeetingNoteCriteriaSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    description : {
        type : String,
        required: true   
    },
    criteria_nature: {
        type: String,
        required: true,
        enum: ["technical", "moral", "both"]
    },
    importance: {
        type: Number,
        required: true,
        enum: [0,1,2,3,4,5]
    }
});

var meetingnotecriteria = mongoose.model('MeetingNoteCriteria',MeetingNoteCriteriaSchema);

module.exports = meetingnotecriteria;
