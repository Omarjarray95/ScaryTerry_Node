const mongoose = require ('mongoose');

var PlanningSchema = new mongoose.Schema({
    _meeting : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'   
    }
});
mongoose.model('Planning',PlanningSchema);