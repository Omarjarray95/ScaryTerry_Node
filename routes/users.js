var express = require('express');
var router = express.Router();
var user = require('../models/User');

router.post('/login', function(req, res, next)
{
    var username = req.body.username;
    var password = req.body.password;
    user.findOne({username: username.toLowerCase()})
        .then((data) =>
        {
            if (data != null)
            {
                if (data.password === password)
                {
                    res.set('Content-Type', 'application/json');
                    res.status(202).send(data);
                }
                else
                {
                    res.set('Content-Type', 'text/html');
                    res.status(200).send("Incorrect Password.");
                }
            }
            else
            {
                res.set('Content-Type', 'text/html');
                res.status(200).send("No User Found With The Sent Credentials, Please Try Again.");
            }
        })
        .catch(error =>
        {
          res.set('Content-Type', 'text/html');
          res.status(500).send(error);
        });
});

module.exports = router;
