const mongoose = require('mongoose');
var SolutionSchema = mongoose.Schema({
    content: {
        type: String,
        required: false
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    added_at: {
        type: Date,
        required: true
    }
});

var ImpedimentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    added_at: {
        type: Date,
        required: true
    },
    solution: [SolutionSchema],
    importance: {
        type: Number,
        required: false,
        enum: [0, 1, 2, 3, 4, 5]
    },
    important_by:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    deleted:{
        type:Boolean,
        required:true,
        default:false
    }
});
ImpedimentSchema.index({
    name: 'text',
    content: 'text',
}, {
    weights: {
        name: 5,
        content: 5,
    },
});
var impediment = mongoose.model('Impediment', ImpedimentSchema);

module.exports = impediment;