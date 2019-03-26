var mongoose = require('mongoose');

var itemSchema = mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        priority: {type: Number, required: true}
    });

var item = mongoose.model('Item', itemSchema);

module.exports = item;