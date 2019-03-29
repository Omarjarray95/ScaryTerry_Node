const mongoose = require ('mongoose');
var UserStorySchema = new mongoose.Schema({
    as_a : {
        type : String,
        required: true
    },
    i_can : {
        type : String,
        required: true
    },
    date_posted : {
        type : Date,
        required: true   
    },
    estimation : {
        type : Number,
        required: true
    },
    priority : {
        type : Number,
        required : true
    },
    _project : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Project'
    }
});
module.exports = mongoose.model('UserStory',UserStorySchema);