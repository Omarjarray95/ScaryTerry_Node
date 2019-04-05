var mongoose = require('mongoose');
var AbsenteeismeSchema = new mongoose.Schema({
    date: { type: Date },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Absenteeisme', AbsenteeismeSchema);