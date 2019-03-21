const mongoose = require ('mongoose');
const task = require('./task');
var SprintSchema = new mongoose.Schema({
    date_start : {
        type : Date,
        required: true   
    },
    duration : {
        type : number,
        required: true
    },
    _sprint_backlog : {
        type :mongoose.Schema.Types.ObjectId,
        ref: task   
    }
});
mongoose.model('Sprint',SprintSchema);