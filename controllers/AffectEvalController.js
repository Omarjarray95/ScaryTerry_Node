const Evaluation = require('../models/Evaluation');
const Project = require('../models/Project');
const User = require('../models/User');
const Conn_Location = require('../models/ConnectionLocation');
var affect_evaluation = (req, res) => {
    insert_eval(req, res, '5c926640db149e155096dfa9', '5c97d1b2d2e6422978ec8960');
    /*project =new Project({Name : 'abdou',description : 'project1'});
    project.save((err,doc)=>{
        if(err)
        res.status(500).send(err);
        res.send(doc);
    });*/


};
async function insert_eval(req, res, userId, projectId) {
    var project;
    var user;
    await Project.findById(projectId).then((data) => {
        project = data;
    }).catch((error) => {
        res.set('Content-Type', 'text/html');
        res.status(500).send(error);
    }
    );
    await User.findById(userId).then((data) => {
        user = data;
    }).catch((error) => {
        res.set('Content-Type', 'text/html');
        res.status(500).send(error);
    }
    );
    var evaluation = new Evaluation();
    evaluation.project = project;
    evaluation.user = user;
    evaluation.note = { communication: '5' };
    evaluation.markModified('note');
    evaluation.save((err, doc) => {
        if (err)
            res.status(500).send(err);
        res.send(doc);


    });
    /*.then((data)=>{
        res.send(data);
    }).catch((error)=>{
        res.set('Content-Type', 'text/html');
        res.status(500).send(error);
    });*/


}
var insert_connection_location = (req, res) => {
    var conn_Location = new Conn_Location({
        longitude: req.query.long,
        latitude: req.query.lat,
        _user: req.params.id
    });
    conn_Location.save().then((doc) => {
        doc.populate("_user").
            execPopulate().then(data => {
                console.log(data);
                res.status(200).json(data);

            }
            ).catch(error =>
                res.status(500).json(error)
            );
    }).catch(error =>
        res.status(500).json(error)
    );
};

module.exports = { add_evaluation: affect_evaluation, add_connection_location: insert_connection_location };