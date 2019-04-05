var mongoose = require('mongoose');

var sprintSchema = mongoose.Schema(
    {
        goal: {type: String, required: true},
        description: {type: String, required: true},
        startDate: {type: Date, required: false},
        duration: {type: Number, required: true},
        sprintBacklog: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserStory', required: false}],
        supplement: {type: mongoose.Schema.Types.ObjectId, ref: 'Increment', required: false}
    });

var sprint = mongoose.model('Sprint', sprintSchema);

module.exports = sprint;
