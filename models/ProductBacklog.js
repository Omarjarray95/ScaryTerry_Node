var mongoose = require('mongoose');

var scaleSchema = mongoose.Schema(
    {
        minimum: {type: Number, required: false, default: 0},
        maximum: {type: Number, required: false, default: 100}
    });

var backlogSchema = mongoose.Schema(
    {
        items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: false}],
        scale: scaleSchema
    });

var backlog = mongoose.model('ProductBacklog', backlogSchema);

module.exports = backlog;