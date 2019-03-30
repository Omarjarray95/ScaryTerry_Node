var mongoose = require('mongoose');

var productSchema = mongoose.Schema(
    {
        items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: false}],
        useable: {type: Boolean, required: true, default: false},
        progress: {type: Number, required: true, default: 0, max: 100}
    });

var product = mongoose.model('Product', productSchema);

module.exports = product;