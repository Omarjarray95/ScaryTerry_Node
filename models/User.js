var mongoose = require('mongoose');

var userSchema = mongoose.Schema(
    {
        username: {type: String, unique: true, required: true},
        password: {type: String, unique: true, required: true}
    });

var user = mongoose.model('User', userSchema);

module.exports = user;
