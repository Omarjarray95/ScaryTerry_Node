var express = require('express');
var Note = require('../models/MeetingNote');
var router = express.Router();

router.get('/', function(req, res){
    console.log('Getting all Meeting notes');
    Note.find({}).exec(function(err, notes){
        if(err) {
            res.send('error has occured');
        } else {
            console.log(notes);
            res.json(notes);
        }
    });
});

router.get('/find/:id', function(req, res){
    console.log('getting one note');
    Note.findOne({
        _id: req.params.id
    }).exec(function(err, note){
        if(err) {
            res.send("Couldn't find note.");
        } else {
            console.log(note);
            res.json(note);
        }
    });
});

router.post('/', function(req, res){
    var newNote = new Note();
    newNote.made_by = req.body.made_by;
    newNote.attributed_to = req.body.attributed_to;
    newNote.date =Date.now();
    newNote.note = req.body.note;
    newNote.during_event= req.body.during_event;
    newNote.remark=req.body.remark;
    newNote.criteria=req.body.criteria;
    newNote.save(function(err, note){
        if(err) {
            res.send('error saving note');
        } else {            
            res.send(note);
        }
    });
});

router.put('/:id', function(req, res, next)
{
    var name = req.body.name;
    var description = req.body.description;
    var criteria_nature = req.body.criteria_nature
    var importance = req.body.importance;

    Note.findOne({"_id": req.params.id}, function (error, note)
    {
        note.name= name;
        note.description = description;
        note.criteria_nature = criteria_nature;
        note.importance=importance;
        note.save();
    })
        .then(() =>
        {
            res.set('Content-Type', 'text/html');
            res.status(202).send("The note Has Been Updated Successfully !");

        })
        .catch(error =>
        {      
            res.set('Content-Type', 'text/html');
            res.status(500).send(error);
        });
});



router.delete('/:id', function(req, res){
    Note.findByIdAndRemove({
        _id: req.params.id
    },function(err, note){
        if(err) {
            res.send('error deleting note');
        } else {
            console.log(note);
            res.send(note);
        }
    });
});

module.exports = router;