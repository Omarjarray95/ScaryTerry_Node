const mongoose = require ('mongoose');

var MeetingSchema = new mongoose.Schema({
    _sprint : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Sprint'
    }
});
module.exports = mongoose.model('Meeting',MeetingSchema);