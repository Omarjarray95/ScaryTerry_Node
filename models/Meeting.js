const mongoose = require ('mongoose');

var MeetingSchema = new mongoose.Schema({
    _sprint : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Sprint'
    }
});
mongoose.model('Meeting',MeetingSchema);