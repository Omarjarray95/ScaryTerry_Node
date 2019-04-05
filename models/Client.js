const mongoose = require ('mongoose');

var ClientSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required: true
    },
    phone_number : {
        type : String,
        required: true
        
    }
});
var client =mongoose.model('Client',ClientSchema);
module.exports = client;