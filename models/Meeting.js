const mongoose = require ('mongoose');
const sprint = require('./Sprint');
var MeetingSchema = new mongoose.Schema({
    _sprint : {
        type :mongoose.Schema.Types.ObjectId,
        ref: sprint
    }
});
mongoose.model('Meeting',MeetingSchema);