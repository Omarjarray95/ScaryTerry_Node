var mongoose = require('mongoose');

var programSchema = mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        description: {type: String, required: false}
    });

var program = mongoose.model('Program', programSchema);

module.exports = program;