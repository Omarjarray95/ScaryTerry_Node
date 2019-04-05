var mongoose = require('mongoose');

var userSchema = mongoose.Schema(
    {
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        role: {type: String, required: true, enum: ["Administrator", "Employee", "Client", "HR Manager"]},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        entreprise: {type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise', required: true},
        lastLogin: {type: Date, required: false},
        skills: [{type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: false}],
        availability: {type: String, required: false, enum: ["Available", "Not Available", "Available Soon", "Busy Soon"]}
    });

var user = mongoose.model('User', userSchema);

module.exports = user;
