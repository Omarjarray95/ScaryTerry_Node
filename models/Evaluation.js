var mongoose = require('mongoose');

var evaluationSchema = mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        field: {type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true},
        location: {type: String, required: true},
        description: {type: String, required: false}
    });

var evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = evaluation;