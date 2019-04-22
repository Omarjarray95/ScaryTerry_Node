var Contract = require('../models/Contract');
var Seniority = require('../models/Seniority');
var _ = require('lodash');

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
    // NOTE: in the case of the hiring process , the user doesn't yet exists in the database .
    // so we have 2 ways of doing it , first adding the user then affect the contract 
    // second , add the user while creating the contract
    // for the moment i will go with the first option.

    var _employee = req.params.id;
    Contract.find({
        _employee,
        state: { $nin: ["Hired", "Promoted", "Fired", "Dismissed", "Prolonged"] }
    })
        .find(data => {

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

        }).catch(err => {

        });
}

//TODO: Complete this crucial function
var promote = (req, res) => {

    let _employee = req.params.id;

    Contract.getByEmployee(_employee, async function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        if (!data) {
            res.status(301).json({ message: "This employee has not an active contract" });
        } else {

            var old_seniority = null;
            await Seniority.findById(data._seniority)
                .then(data => {
                    if (!data) {
                        res.status(500).json({ "error": "There's no seniority" });
                    }
                    old_seniority = data;
                })
                .catch(err =>
                    res.status(500).json(err)
                );
            Seniority.nextSeniority(old_seniority)
                .then(seniority => {

                    console.log(seniority);
                    let new_contract = new Contract(_.pick(data, ['_employee', 'salary', 'job', 'date_end_contract']));

                    //DONE: change the date save with the static method in the ContractSchema
                    data.state = "Promoted";
                    data.date_end = Date.now();
                    data.save()
                        .then(data => {
                            new_contract.data_start = data.date_end;

                            new_contract.seniority = seniority;
                            Contract.create(new_contract)
                                .then(data => {
                                    res.status(200).json(data);
                                }).catch(err => {
                                    res.status(500).json(err);
                                });
                        })
                        .catch(err => {
                            res.status(500).json(err);
                        })
                }
                ).catch(err => {
                    res.status(500).json(err);

                });
        }
    });
}

var prolongation = (req, res, next) => {
    var _employee = req.params.id;

    Contract.getByEmployee(_employee, function (err, data) {
        if (err) {
            res.status(500).json(err);
        }
        if (!data) {
            res.status(301).json({ message: "This employee has not an active contract" });
        } else {
            let new_contract = new Contract(_.pick(data, ['_employee', 'salary', 'seniority', 'job']));
            let duration = Number.parseInt(req.query.duration);
            //DONE: change the date save with the static method in the ContractSchema
            data.state = "Prolonged";
            data.date_end = Date.now();
            data.save()
                .then(data => {
                    new_contract.data_start = data.date_end;

                    let data_end_date = new Date(data.date_end_contract);
                    let new_end_date = data_end_date.setMonth(data.date_end_contract.getMonth() + duration);
                    new_contract.date_end_contract = new_end_date;

                    Contract.create(new_contract)
                        .then(data => {
                            res.status(200).json(data);
                        }).catch(err => {
                            res.status(500).json(err);
                        });
                })
                .catch(err => {
                    res.status(500).json(err);
                })
        }
    })
}

var fire = (req, res, next) => {
    var _employee = req.params.id;

    Contract.fire(_employee, function (err, data) {
        if (err) {
            res.status(500).json(err);
        } if (!data) {
            res.status(301).json({ message: "This employee has not an active contract" });

        } else {
            res.status(200).json(data);
        }
    });

}

var allContractByEmployee = (req, res, next) => {
    var query = {};
    var _employee = req.query.employee;
    if (_employee) {
        query = { _employee }
    }
    Contract.find(query)
        .sort({ date_start: -1 })
        .populate("_employee")
        .exec()
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json(err);
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

var endAt = (req, res, next) => {
    var _employee = req.params.id;

    Contract.getByEmployee(_employee)
        .then(data => {
            let date = new Date(data.date_end_contract);
            res.status(200).json(date);
        }).catch(err => {
            res.status(500).json(err);
        });
}

var getContracts = (employee, from, to, fired, conditions) => {

    conditions.date_end = { $exists: true };
    if (fired !== null) {
        conditions.fired = fired;
    }
    if (from) {
        // let condition = {date_end : {$gte: new Date(from)}};
        conditions.date_end.$gte = new Date(from);
    } if (to) {
        conditions.date_end.$lte = new Date(to);
    } if (employee) {
        conditions._employee = { _employee: employee };
    }
    return Contract.find(conditions);

}

var advancedContracts = (req, res, next) => {
    let fired = req.query.fired;
    let conditions = {};
    let from = req.query.from;
    let to = req.query.to;
    let _employee = req.query.employee;
    getContracts(_employee, from, to, fired, conditions)
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}

var advancedContractsCount = (req, res, next) => {
    let fired = req.query.fired;
    let conditions = {};
    let from = req.query.from;
    let to = req.query.to;
    let _employee = req.query.employee;
    getContracts(_employee, from, to, fired, conditions)
        .count()
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json(err);
        });
}


// FIXME: I have to fix some cases , like if an employee have one promotion
// as well as look for all the cases by testing with more than user , and also 
// by using the already done functions 
// HINT: Group by could be a solution for the average
// TODO: try if the case that counting the promotions and divide it by the duration 
// give the waited result or not

var avgPromotion = (req, res, next) => {
    let _employee = req.query.employee;
    let condition = { state: "Promoted" };

    if (_employee) {
        condition._employee = _employee;
    }

    Contract.find(condition)
        .sort({ date_end: -1 })
        .then(data => {

            // TODO: Correct it , reduce will not give the exact result 
            // [a,b,c,d] => a-b + b-c + c-d
            // NOTE: This Solution could be done by mapping into tuple [a,b],[b,c],[c,d]
            // and then reduce it by adding the diff between each tuple , or simply by 
            // mapping it to the difference between item and its next , of course by checking 
            // the first or last item to avoid conflicts 


            let dates = data.map(e => e.date_end);
            console.log(dates);

            // let result = dates.forEach((date, index) => {
            //     if (index === 0) {
            //         return;
            //         // continue; => in the case of while or for loop
            //     }
            //     avg += dates[index - 1] - date;

            // }, 0);
            let avg = 0;
            if (dates.length) {
                avg = (dates[0].date_start - _.last(dates).date_start) / dates.length;
            }
            res.status(200).json({
                average: (avg / 3600 / 24 / 1000).toFixed(3)
            });
        }).catch(err => {
            console.log("whaaat");
            console.log(err);
            res.status(500).json(err);
        });
}

module.exports = {
    getCurrentContract,
    hire,
    get,
    isFired,
    fire,
    prolongation,
    allContractByEmployee,
    endAt,
    advancedContracts,
    advancedContractsCount,
    avgPromotion,
    promote
}