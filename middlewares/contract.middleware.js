var Contract = require('../models/Contract');

var isHired = (req, res, next) => {
    var _employee = req.params.id;

    Contract.getByEmployee(_employee, function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        if (data) {
            console.log(data);
            res.status(409).json({ message: "This Employee is already hired . we cannot hire a hired employee , maybe you mean to promote or demote him ." });
            return;
        } else {

            console.log("i am advancing");
            next();
        }
    });

}

module.exports = {
    isHired,
}