var mongoose = require('mongoose');
var mongoose_archive = require('mongoose-archive');

var jobOfferSchema = mongoose.Schema({
    _applications: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Application" }] },
    description: { type: String, required: true },
    _job: { type: mongoose.SchemaTypes.ObjectId, ref: "Job", required: true },
    requirements: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Skill" }], required: true },
    date_posted: { type: Date, default: Date.now() },
    completed : {type:Boolean,default:false}
});

module.exports = mongoose.model("JobOffer", jobOfferSchema);
