var mongoose = require('mongoose');
var mongoose_archive = require('mongoose-archive');

var jobOfferSchema = mongoose.Schema({
    _applications: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Application" }] },
    description: { type: String, required: true },
    _job: { type: mongoose.SchemaTypes.ObjectId, ref: "Job", required: true },
    requirement: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Skill" }], required: true }

});

module.exports = mongoose.model("JobOffer", jobOfferSchema);
