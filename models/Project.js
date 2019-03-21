const mongoose = require ('mongoose');
const user = require('./User');
const client = require('./Client');
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
        type : Date,
        required: true   
    },
    date_end : {
        type : Date,
        required: true
    },
    _scrum_master : {
        type :mongoose.Schema.Types.ObjectId,
        ref: user   
    },
    _product_owner : {
        type :mongoose.Schema.Types.ObjectId,
        ref: user  
    },
    _client : {
        type :mongoose.Schema.Types.ObjectId,
        ref: client
    }
});
mongoose.model('Project',ProjectSchema);