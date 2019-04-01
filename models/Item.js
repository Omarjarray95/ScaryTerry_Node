var mongoose = require('mongoose');

var itemSchema = mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        priority: {type: Number, required: true},
        category: {type: String, required: true, enum: ["Feature", "Function", "Requirement", "Enhacement", "Fix"]},
        state: {type: String, required: true, enum: ["Pending", "In Progress", "Done"], default: "Pending"}
    });

var item = mongoose.model('Item', itemSchema);

module.exports = item;