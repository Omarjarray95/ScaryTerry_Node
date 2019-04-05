var mongoose = require('mongoose');

var incrementSchema = mongoose.Schema(
    {
        userStories: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserStory', required: false}],
        useable: {type: Boolean, required: true, default: false},
        progress: {type: Number, required: true, default: 0, max: 100}
    });

var increment = mongoose.model('Increment', incrementSchema);

module.exports = increment;