var mongoose = require('mongoose');

var evaluationSchema = mongoose.Schema(
    {
        note: mongoose.Schema.Types.Mixed,
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project', required : true},
        });

var evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = evaluation;