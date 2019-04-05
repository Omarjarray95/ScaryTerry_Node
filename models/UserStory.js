var mongoose = require('mongoose');

var storySchema = mongoose.Schema(
    {
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: false },
        title: { type: String, required: true },
        description: { type: String, required: true },
        priority: { type: Number, required: true },
        estimatedTime: { type: Number, required: false },
        startDate: { type: Date, required: false, default: Date.now() },
        duration: { type: Number, required: false },
        state: { type: String, required: true, enum: ["Pending", "In Progress", "Done"], default: "Pending" },
        resource: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        testDescription: { type: String, required: false }
    });

var userStory = mongoose.model('UserStory', storySchema);

module.exports = userStory;