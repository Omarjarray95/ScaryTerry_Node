var mongoose = require('mongoose');

var projectSchema = mongoose.Schema(
    {
        creationDate: { type: Date, required: true, default: Date.now() },
        program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: false },
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
        entreprise: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise', required: true },
        startDate: { type: Date, required: false },
        endDate: { type: Date, required: false },
        duration: { type: Number, required: false },
        skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: false }],
        productOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        scrumMaster: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        developmentTeam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
        productBacklog: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductBacklog', required: false },
        sprints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', required: false }],
        state: { type: String, required: true, enum: ["Pending", "In Progress", "Done"], default: "Pending" }
    });

var project = mongoose.model('Project', projectSchema);

module.exports = project;
