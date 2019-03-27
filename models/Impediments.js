const mongoose = require ('mongoose');

var ImpedimentSchema = new mongoose.Schema({
    content : {
        type : String,
        required: true
    },
    added_by:{
        type :mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    added_at: {
        type:Date,
        required:true
    },
    solution: {
        type: String,
        required: false
    },
    solution_proposed_at:{
        type: String,
        required: false
    },
    solution_added_by:{
        type :mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    importance: {
        type: Number,
        required:false,
        enum: [0,1,2,3,4,5]
    }
});

var impediment = mongoose.model('Impediment',ImpedimentSchema);

module.exports = impediment;
