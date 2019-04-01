

// logout => disconnectedAt : Date.now();
//find by user_id (latest connectedAt or ( disconnectedAt : null ))
//=> for a new connection for the same user should not has a null disconnectedAt   
//=> add connection => look if there's not closed for that user => disconnectedAt:Date.now()
var mongoose = require('mongoose');
var ConnectionLocationSchema = new mongoose.Schema({
    connectedAt: { type: Date, default: Date.now() },
    disconnectedAt: { type: Date, default: Date.now() },
    longitude: { type: Number },
    latitude: { type: Number },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('ConnectionLocation', ConnectionLocationSchema);