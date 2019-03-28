var mongoose = require('mongoose');

var storySchema = mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        priority: {type: Number, required: true},
        estimatedTime: {type: Number, required: true},
        resource: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false}
    });

var userStory = mongoose.model('UserStory', storySchema);

module.exports = userStory;