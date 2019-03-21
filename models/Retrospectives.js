const mongoose = require ('mongoose');

var RetrospectivesSchema = new mongoose.Schema({
    _meeting : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'   
    }
});
mongoose.model('Retrospectives',RetrospectivesSchema);