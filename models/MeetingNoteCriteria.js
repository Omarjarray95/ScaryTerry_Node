const mongoose = require ('mongoose');

var MeetingNoteCriteriaSchema = new mongoose.Schema({
    label : {
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
        enum: ["Technical", "Moral", "Both"]
    },
    importance: {
        type: Number,
        required: true,
        enum: [0,1,2,3,4,5]
    }
});

var meetingnotecriteria = mongoose.model('MeetingNoteCriteria',MeetingNoteCriteriaSchema);

module.exports = meetingnotecriteria;
