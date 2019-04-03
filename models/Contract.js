var mongoose = require('mongoose');

var contractSchema = mongoose.Schema({
    _employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date_start: { type: Date, default: Date.now() },
    date_end_contract: { type: Date }, // date of end in the contract
    date_end: { type: Date }, // when the contract had really ended
    salary: { type: Number },
    fired: { type: Boolean },
    state: { type: String, enum: ["Hired", "Promoted", "Fired", "Dismissed", "Prolonged"] },
    _job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    _seniority: { type: mongoose.Schema.Types.ObjectId, ref: 'Seniority' },
});

//TODO: static method to end the contract

contractSchema.statics.getByEmployee = function (_employee, cb) {
    //DONE: manage the condition of date_end
    return this.findOne({ _employee, date_end: { $exists: false } }, cb);
}
contractSchema.statics.isFired = function (_employee, cb) {
    return this.findOne({ _employee, date_end: { $exists: true }, fired: true }, function (err, data) {
        cb(err, data !== null);
    });
}
contractSchema.statics.fire = function (_employee, cb) {
    return this.getByEmployee(_employee, function (err, data) {
        if (data !== null) {

            data.date_end = Date.now();
            data.fired = true;
            data.save(function (err, data) {

                cb(err, data);
            });
        }
        else {
            cb(err, data);
        }
    });
}

module.exports = mongoose.model('Contract', contractSchema);