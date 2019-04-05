var mongoose = require('mongoose');
var DayOffsSchema = new mongoose.Schema({
    date: { type: Date },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('DayOffs', DayOffsSchema);