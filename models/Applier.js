var mongoose = require('mongoose');
var mongooseArchive = require('mongoose-archive');
//TODO: Add Some other fields to make this collection more meaningful
var applierSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    linkedIn_profile: { type: String },
    _applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    _skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],

});

applierSchema.plugin(mongooseArchive);

module.exports = mongoose.model('Applier', applierSchema);