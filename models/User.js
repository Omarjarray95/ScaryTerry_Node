var mongoose = require('mongoose');

var userSchema = mongoose.Schema(
    {
        username: { type: String, unique: true, required: true },
        //password should not be unique
        password: { type: String, unique: true, required: true },
        avatar: { type: String },
        last_auth: { type: Date },
        email: { type: String },
    });

var user = mongoose.model('User', userSchema);

module.exports = user;
