var mongoose = require('mongoose');
const State = require('../utils/enums/Task').state;

var taskSchema = mongoose.Schema(
    {
        //foreign key for user-story
        _story: { type: mongoose.Schema.Types.ObjectId, ref: "UserStory" },
        description: { type: String },
        state: { type: String, enum: State, default: State[0] },
        _owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        log: { type: String },
        _skills: { type: mongoose.Schema.Types.ObjectId, ref: "Skills" }
    }
);

module.exports = mongoose.model('Task', taskSchema);