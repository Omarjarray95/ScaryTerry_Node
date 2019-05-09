const mongoose = require('mongoose');

var ImpedimentSolutionSchema = mongoose.Schema({
    content: {
        type: String,
        required: false
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    starred_by:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    added_at: {
        type: Date,
        required: true
    }
});
var solution = mongoose.model('ImpedimentSolution', ImpedimentSolutionSchema);

module.exports = solution;
