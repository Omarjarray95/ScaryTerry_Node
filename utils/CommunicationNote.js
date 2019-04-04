const MeetingNote = require('../models/MeetingNote');
const MeetingNoteCriteria = require('../models/MeetingNoteCriteria');

function insertMeetingNoteCriteria() {
    meetingNoteCriteria = new MeetingNoteCriteria({
        name: 'communication',
        description: 'elaborating ',
        criteria_nature: 'both',
        importance: 5
    });
    meetingNoteCriteria2 = new MeetingNoteCriteria({
        name: 'communication',
        description: 'bodylanguage',
        criteria_nature: 'moral',
        importance: 3
    });
    meetingNoteCriteria3 = new MeetingNoteCriteria({
        name: 'communication',
        description: 'expression',
        criteria_nature: 'moral',
        importance: 4
    });
    meetingNoteCriteria.save().then((data) => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
    meetingNoteCriteria2.save().then((data) => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
    meetingNoteCriteria3.save().then((data) => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}
function insertMeetingNote() {
    meetingNote = new MeetingNote({
        made_by: '5ca4bbf13077804740ee3a0e',//abdou
        attributed_to: '5c926640db149e155096dfa9',//mahdi
        date: new Date(),
        note: 1,
        criteria: '5ca4c5feb71b8a4704273848'//elab both
    });
    meetingNote1 = new MeetingNote({
        made_by: '5ca4bce73077804740ee3a0f',//omar
        attributed_to: '5c926640db149e155096dfa9',//mahdi
        date: new Date(),
        note: 1,
        criteria: '5ca4c5feb71b8a4704273849'//bodylanguage moral
    }); meetingNote2 = new MeetingNote({
        made_by: '5ca4fd813077804740ee3a10',//ahmed
        attributed_to: '5c926640db149e155096dfa9',//mahdi
        date: new Date(),
        note: -1,
        criteria: '5ca4c5feb71b8a470427384a'//expression moral
    }); meetingNote3 = new MeetingNote({
        made_by: '5c926640db149e155096dfa9',//mahdi
        attributed_to: '5ca4bbf13077804740ee3a0e',//abdou
        date: new Date(),
        note: -1,
        criteria: '5ca4c5feb71b8a470427384a'//expression moral
    }); meetingNote4 = new MeetingNote({
        made_by: '5ca4fdb33077804740ee3a11',//momo
        attributed_to: '5c926640db149e155096dfa9',//mahdi
        date: new Date(),
        note: -1,
        criteria: '5ca4c5feb71b8a4704273848'//elab both
    });
    meetingNote.save().then((data) => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
    meetingNote1.save().then((data) => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
    meetingNote2.save().then((data) => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
    meetingNote3.save().then((data) => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
    meetingNote4.save().then((data) => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });

}
async function getmeetingNoteByCriteria(importanceGTE, criteriaType, from, to) {
    console.log(from);
    console.log(to);
    let result = [];
    await MeetingNote.aggregate([
        {
            $lookup: {
                from: "meetingnotecriterias",
                localField: "criteria",
                foreignField: "_id",
                as: "meetingnotecriteria"
            }
        },
        {
            $match: {
                $and: [
                    { meetingnotecriteria: { $elemMatch: { importance: { '$gte': importanceGTE } } } },
                    { meetingnotecriteria: { $elemMatch: { criteria_nature: criteriaType } } },
                    { date: { '$lte': to, '$gte': from } }
                ]
            }
        }

    ]).then(data => {
        console.log(data)
        result = data;
    }).catch(err => {
        console.log(err)
    });

    return result;

}
async function getCommunication(importanceGTE, criteriaType, from, to) {

}
module.exports = {
    insertMeetingNoteCriteria: insertMeetingNoteCriteria,
    insertMeetingNote: insertMeetingNote,
    getmeetingNoteByCriteria: getmeetingNoteByCriteria
}