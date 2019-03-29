const mongoose = require ('mongoose');
var SprintSchema = new mongoose.Schema({
    date_start : {
        type : Date,
        required: true   
    },
    duration : {
        type : Number,
        required: true
    },
    _sprint_backlog : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Task'   
    }
});
module.exports = mongoose.model('Sprint',SprintSchema);