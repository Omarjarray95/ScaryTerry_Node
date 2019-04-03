var mongoose = require('mongoose');

var entrepriseSchema = mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        field: {type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true},
        location: {type: String, required: false},
        description: {type: String, required: false}
    });

var entreprise = mongoose.model('Entreprise', entrepriseSchema);

module.exports = entreprise;