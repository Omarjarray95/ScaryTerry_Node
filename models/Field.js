var mongoose = require('mongoose');

var fieldSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {type: String, required: true, unique: true},
        description: {type: String, required: false}
    });

var field = mongoose.model('Field', fieldSchema);

module.exports = field;