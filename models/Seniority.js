var mongoose = require('mongoose');

var senioritySchema = mongoose.Schema({
    seniority: { type: String },
    level: { type: Number }
});

module.exports = mongoose.model('Seniority', senioritySchema);