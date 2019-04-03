var mongoose = require('mongoose');
var mongooseArchive = require('mongoose-archive');
//TODO: Add Some other fields to make this collection more meaningful
var applierSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    linkedIn_profile: { type: String, required: true },
    _skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    _applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
});

applierSchema.plugin(mongooseArchive);

module.exports = mongoose.model('Applier', applierSchema);