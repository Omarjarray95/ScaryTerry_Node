var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
    _applier: { type: mongoose.SchemaTypes.ObjectId, ref: "Applier", required: true },
    _quiz: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Quiz" }],
    _code: { type: mongoose.SchemaTypes.ObjectId, ref: "Code" },
    score: { type: Number, max: 20, min: 0 },
    code: { type: String },

});

module.exports = mongoose.model("Test", TestSchema);   