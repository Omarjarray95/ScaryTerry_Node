const mongoose = require ('mongoose');

var ImpedimentSchema = new mongoose.Schema({
    name : {
        type:String,
        required:false
    },
    content : {
        type : String,
        required: true
    },
    added_by:{
        type :mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
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
        type: Date,
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
    },
    sprints_affected:[{
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Sprint',
        required: false
    }]
});
ImpedimentSchema.index({
    name: 'text',
    content: 'text',
  }, {
    weights: {
      name: 5,
      content: 5,
    },
  });
var impediment = mongoose.model('Impediment',ImpedimentSchema);

module.exports = impediment;
