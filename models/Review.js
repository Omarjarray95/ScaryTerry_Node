const mongoose = require ('mongoose');

var ReviewSchema = new mongoose.Schema({
    _meeting : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'   
    }
});
mongoose.model('Review',ReviewSchema);