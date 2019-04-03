var Code = require('../models/Code');

//TODO: read and write a file in the database

var add = (req, res, next) => {
    let problem = req.body.problem;
    let _tags = req.body.tags;
    let level = req.body.level;

    Code.create({
        problem,
        _tags,
        level
    }).then(code => {
        res.status(200).json(code);
    }).catch(err => {
        res.status(500).json(err);
    });

}

var get = (req, res, next) => {
    query = {};

    Code.find(query)
        .then(code => {
            res.status(200).json(code);
        }).catch(err => {
            res.status(500).json(err);
        });
}

module.exports = {
    add,
    get,
}


// var JSHINT = require('jshint').JSHINT;

// var source = [
//     'function goo() { var n = 1 ;while(n<6) {var x = 1 ; n++;}}',
//     'foo = 3;'
// ];
// var options = {
//     undef: true,
//     plusplus: true
// };
// var predef = {
//     foo: false
// };

// JSHINT(source, options, predef);

// console.log(JSHINT.data());