const mongoose = require ('mongoose');
const project = require('./Project');
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
        type : number,
        required: true
    },
    priority : {
        type : number,
        required : true
    },
    _project : {
        type : mongoose.Schema.Types.ObjectId,
        ref : project  
    }
});
mongoose.model('UserStory',UserStorySchema);