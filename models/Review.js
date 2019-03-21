const mongoose = require ('mongoose');
const meeting = require('./Meeting');
var ReviewSchema = new mongoose.Schema({
    _meeting : {
        type :mongoose.Schema.Types.ObjectId,
        ref: meeting   
    }
});
mongoose.model('Review',ReviewSchema);