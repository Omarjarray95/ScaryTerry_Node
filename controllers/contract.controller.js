var Contract = require('../models/Contract');

var getCurrentContract = (req, res, next) => {
    let _employee = req.query.employee;

    Contract.getByEmployee(_employee, function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        res.status(200).json(data);
    })
}

var get = (req, res, next) => {
    var _id = req.params.id;

    Contract.findById(_id).
        then(async data => {
            res.status(200).json(await data.populate('_employee').execPopulate());
        }).
        catch(err => {
            res.status(500).json(err);
        })
}

var hire_function = (_employee, contract, res) => {
    contract._employee = _employee;
    Contract.create(contract).
        then(data => {
            return data;
        }).catch(err => {
            res.status(500).json(err);
        });
}

var hire = (req, res, next) => {
    //NOTE: in the case of the hiring process , the user doesn't yet exists in the database .
    // so we have 2 ways of doing it , first adding the user then affect the contract 
    // second , add the user while creating the contract
    // for the moment i will go with the first option.

    var _employee = req.params.id;

    var contract = new Contract({
        _employee,
        date_end_contract: new Date(req.body.end_contract), // date of end in the contract
        salary: req.body.salary,
        _job: req.body._job,
        _seniority: req.body._seniority,
    });
    contract.save()
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}

var promote = (_employee, level, res) => {
    Contract.findOne()
}

var prolongation = (req, res, next) => {
    var _employee = req.params.id;

    Contract.getByEmployee(_employee, function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        if (!data) {
            res.status(301).json({ message: "This employee has not an active contract" });
        }
        res.status(200).json(data);
    })
}

var fire = (req, res, next) => {
    var _employee = req.params.id;

    Contract.fire(_employee, function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        res.status(200).json(data);
    });

}

var isFired = (req, res, next) => {
    var _employee = req.params.id;

    Contract.isFired(_employee, function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        res.status(200).json(data);
    });
}

module.exports = {
    getCurrentContract,
    hire,
    get,
    isFired,
    fire,
    prolongation,
}