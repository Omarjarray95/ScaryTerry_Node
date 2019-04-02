const connLocation_utils = require('../utils/connLocation');
const absenteeism_utils = require('../utils/AbsenteeismUtils');
var getConnectionsPerUser = connLocation_utils.getConnectionsPerUser;
var addAbsenteeism = absenteeism_utils.addAbsenteeism;
var countAbsenteeism = absenteeism_utils.countAbsenteeism;
var absenteeismNote = absenteeism_utils.absenteeismNote;
var absenteeismWithDates = absenteeism_utils.absenteeismWithDates;

var get_connections_perUser = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await getConnectionsPerUser(new Date(fromparam), new Date(toparam), userIDparam);
    res.send({ 'connections': result });
}
var count_absenteeism = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await countAbsenteeism(new Date(fromparam), new Date(toparam), userIDparam);
    res.send({ 'number of days absent ': result });
}
var absenteeism_note = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await absenteeismNote(new Date(fromparam), new Date(toparam), userIDparam);
    res.send({ 'absenteeism note': result });
}
var add_absenteeism = async (req, res) => {
    await addAbsenteeism();
    res.send('ok');
}
var absenteeism_withDates = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await absenteeismWithDates(new Date(fromparam), new Date(toparam), userIDparam);
    res.send(result);
}


module.exports = {
    get_connections_perUser: get_connections_perUser,
    add_absenteeism: add_absenteeism,
    count_absenteeism: count_absenteeism,
    absenteeism_note: absenteeism_note,
    absenteeism_withDates: absenteeism_withDates
}