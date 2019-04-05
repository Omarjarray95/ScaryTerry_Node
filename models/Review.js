const mongoose = require ('mongoose');

var ReviewSchema = new mongoose.Schema({
    _meeting : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'   
    }
});
module.exports = mongoose.model('Review',ReviewSchema);