var mongoose = require('mongoose');

var senioritySchema = mongoose.Schema({
    seniority: { type: String },
    level: { type: Number }
});

senioritySchema.statics.nextSeniority = function (seniority) {
    return this.findOne({ level: { $gt: seniority.level } }).sort({ level: 1 });
}

module.exports = mongoose.model('Seniority', senioritySchema);