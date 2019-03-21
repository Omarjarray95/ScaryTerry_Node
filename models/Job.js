var mongoose = require('mongoose');

var jobSchema = mongoose.Schema({
    title: { type: String },
    description: { type: String }
});

module.exports = mongoose.model('Job', jobSchema);