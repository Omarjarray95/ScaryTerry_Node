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
mongoose.model('Client',ClientSchema);