const motivation_utils = require('../utils/MotivationUtils');
var isDayOff = motivation_utils.isDayOff;
var isAbsent = motivation_utils.isAbsent;
var isWeekEnd = motivation_utils.isWeekEnd;
var durationPerUSerPunctuality = motivation_utils.duration_perUSer_Punctuality;
var isPonctual = motivation_utils.isPonctual;
var atCompany = motivation_utils.atCompany;
var real_duration = motivation_utils.real_duration;
var userPunctualityNotePerDuration = motivation_utils.userPunctualityNotePerDuration;
var punctualityDaysNumberPerDuration = motivation_utils.punctualityDaysNumberPerDuration;
var punctualityWithDates = motivation_utils.punctualityWithDates;
var insertDayOff = motivation_utils.insertDayOff;
var countDayOff = motivation_utils.countDayOff;
var dayOffNote = motivation_utils.dayOffNote;
var dayoffWithDates = motivation_utils.dayoffWithDates;


var is_ponctual = async (req, res) => {
    var dateparam = req.params.date;
    var userIDparam = req.params.id;
    var result = await isPonctual(new Date(dateparam), userIDparam);
    res.send({ 'is_punctual': result });
}
//insert ****
var is_dayoff = async (req, res) => {
    var dateparam = req.params.date;
    var userIDparam = req.params.id;
    var result = await isDayOff(new Date(dateparam), userIDparam);
    res.send({ 'is_dayoff': result });
}
//insert ****
var is_absent = async (req, res) => {
    var dateparam = req.params.date;
    var userIDparam = req.params.id;
    var result = await isAbsent(new Date(dateparam), userIDparam);
    res.send({ 'is_absent': result });
}
var duration_perUSer_Punctuality = async (req, res) => {
    const fromparam = await req.params.from;
    console.log('from' + new Date(fromparam));
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await durationPerUSerPunctuality(new Date(fromparam), new Date(toparam), userIDparam);
    res.send({ 'duration_perUSer_Punctuality': result });
}
var at_company = async (req, res) => {
    var conlocparam = req.body;
    var result = await atCompany(conlocparam);
    res.send({ 'at_company': result });
}
var insert_dayOff = (req, res) => {
    insertDayOff(req, res);
}
var count_dayOff = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await countDayOff(new Date(fromparam), new Date(toparam), userIDparam);
    res.send({ 'dayoffnumber': result });
}
var day_offNote = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await dayOffNote(new Date(fromparam), new Date(toparam), userIDparam);
    res.send({ 'dayOffNote': result });

}

var dayOff_withDates = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await dayoffWithDates(new Date(fromparam), new Date(toparam), userIDparam);
    res.send({ result });

}
var punctuality_daysNumber_perDuration = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await punctualityDaysNumberPerDuration(new Date(fromparam), new Date(toparam), userIDparam);
    res.send({ 'punctuality_daysNumber_perDuration': result });
}
var punctuality_withDates = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await punctualityWithDates(new Date(fromparam), new Date(toparam), userIDparam);
    res.send(result);
}
var user_punctualityNote_perDuration = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await userPunctualityNotePerDuration(new Date(fromparam), new Date(toparam), userIDparam);
    res.send({ 'userPunctualityNotePerDuration': result });
}


module.exports = {
    is_ponctual: is_ponctual,
    is_absent: is_absent,
    is_dayoff: is_dayoff,
    at_company: at_company,
    insert_dayOff: insert_dayOff,
    count_dayOff: count_dayOff,
    day_offNote: day_offNote,
    dayOff_withDates: dayOff_withDates,
    punctuality_daysNumber_perDuration: punctuality_daysNumber_perDuration,
    punctuality_withDates: punctuality_withDates,
    user_punctualityNote_perDuration: user_punctualityNote_perDuration,
    //isWeekEnd: isWeekEnd,
    duration_perUSer_Punctuality: duration_perUSer_Punctuality,
    /*real_duration: real_duration,
   */
};
