const mongoose = require ('mongoose');
var ProjectSchema = new mongoose.Schema({
    Name : {
        type : String,
        required: true
    },
    description : {
        type : String,
        required: true
    },
    date_start : {
        type : Date  
    },
    date_end : {
        type : Date
    },
    _scrum_master : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'User'   
    },
    _product_owner : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    },
    _client : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    }
});
module.exports = mongoose.model('Project',ProjectSchema);