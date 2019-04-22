const mongoose = require ('mongoose');

var PlanningSchema = new mongoose.Schema({
    _meeting : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'   
    }
});
module.exports = mongoose.model('Planning',PlanningSchema);