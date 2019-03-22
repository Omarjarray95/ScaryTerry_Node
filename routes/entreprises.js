var express = require('express');
var router = express.Router();
var entreprise = require('../models/Entreprise');
var field = require('../models/Field');
var mongoose = require('mongoose');

router.get('/getentreprises', function(req, res, next)
{
    entreprise.find({}).populate('field')
        .then((data) =>
        {
            res.status(202).json(data);
        })
        .catch((error) =>
        {
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});

module.exports = router;