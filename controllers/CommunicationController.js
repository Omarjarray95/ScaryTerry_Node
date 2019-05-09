const MeetingNote_utils = require('../utils/CommunicationNote');
const insertMeetingNoteCriteria = MeetingNote_utils.insertMeetingNoteCriteria;

var insert_MeetingNoteCriteria_test = async (req, res) => {
    insertMeetingNoteCriteria();
    res.send('ok');
}
var insert_MeetingNote_test = async (req, res) => {
    MeetingNote_utils.insertMeetingNote();
    res.send('ok');
}
var getmeeting_Note_ByCriteria = async (req, res) => {
    let imp = Number.parseInt(req.params.importance);
    console.log(req.params.importance);
    console.log(imp);
    res.send(await MeetingNote_utils.getmeetingNoteByCriteria(imp, req.params.criteria, new Date(req.params.from), new Date(req.params.to), req.params.userID));
}
var communication_Note = async (req, res) => {
    MeetingNote_utils.getCommunicationNote(3, new Date(req.params.from), new Date(req.params.to), req.params.userID, function (result) {
        res.status(200).send({ result });
    });
}
var communication_Note_perImp = async (req, res) => {
    MeetingNote_utils.getCommunicationNote(parseInt(req.params.impo, 10), new Date(req.params.from), new Date(req.params.to), req.params.userID, function (result) {
        res.status(200).send({ result });
    });
}

module.exports = {
    insert_MeetingNoteCriteria_test: insert_MeetingNoteCriteria_test,
    insert_MeetingNote_test: insert_MeetingNote_test,
    getmeeting_Note_ByCriteria: getmeeting_Note_ByCriteria,
    communication_Note: communication_Note,
    communication_Note_perImp: communication_Note_perImp
}