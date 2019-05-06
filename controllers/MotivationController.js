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
var extraWorkAtHome = motivation_utils.extraWorkAtHome;
var extraWorkAtHomeNote = motivation_utils.extraWorkAtHomeNote;


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
var user_punctualityNote_stats = async (req, res) => {
    const fromparam = new Date(req.params.from);
    var toparam = new Date();
    var userIDparam = req.params.id;
    let result = [];
    let result2017 = [];
    let result2018 = [];
    let result2019 = [];
    while (fromparam < toparam) {
        console.log('////test f :' + yyyymmdd(fromparam));
        /* fromparam.setMonth(fromparam.getMonth() + 1)
         console.log(fromparam);
         console.log('ok');*/
        let f = new Date(yyyymmdd(fromparam));
        let t = new Date(yyyymmdd(new Date(fromparam.setMonth(fromparam.getMonth() + 1))));
        //console.log('///test t:' + yyyymmdd(new Date(fromparam.setMonth(fromparam.getMonth() + 1))));
        var x = await userPunctualityNotePerDuration(f, t, userIDparam);
        if (f.getFullYear() == 2017)
            result2017.push(Number(x * 100).toFixed(1));
        else if (f.getFullYear() == 2018)
            result2018.push(Number(x * 100).toFixed(1));
        else
            result2019.push(Number(x * 100).toFixed(1));
        console.log(' ///x =' + x)
        result.push(Number(x).toFixed(1));

    }
    res.send({ result2017, result2018, result2019 });

    //var result = await userPunctualityNotePerDuration(new Date(fromparam), new Date(toparam), userIDparam);
    //res.send({ 'userPunctualityNotePerDuration': result });
}
var extra_work_atHome = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await extraWorkAtHome(new Date(fromparam), new Date(toparam), userIDparam);
    res.send({ result });
}
var extra_work_atHome_note = async (req, res) => {
    const fromparam = req.params.from;
    var toparam = req.params.to;
    var userIDparam = req.params.id;
    var result = await extraWorkAtHomeNote(new Date(fromparam), new Date(toparam), userIDparam);
    res.send({ result });
}
var motivation_note = async (req, res) => {
    let today = new Date(yyyymmdd(new Date()));
    let t = new Date(yyyymmdd(new Date()));
    let l1 = new Date(today.setDate(today.getDate() - 1));
    let l7 = new Date(today.setDate(today.getDate() - 6));
    let l28 = new Date(today.setDate(today.getDate() - 21));
    let l90 = new Date(today.setDate(today.getDate() - 62));
    var userIDparam = req.params.id;
    var result1 = parseFloat(await extraWorkAtHomeNote(l1, new Date(), userIDparam));
    var result11 = await dayOffNote(l1, t, userIDparam);
    var result2 = parseFloat(await extraWorkAtHomeNote(l7, new Date(), userIDparam));
    var result22 = await dayOffNote(l7, new Date(), userIDparam);
    var result3 = parseFloat(await extraWorkAtHomeNote(l28, new Date(), userIDparam));
    var result33 = await dayOffNote(l28, new Date(), userIDparam);
    var result4 = parseFloat(await extraWorkAtHomeNote(l90, new Date(), userIDparam));
    var result44 = await dayOffNote(l90, new Date(), userIDparam);

    res.send({
        result1, result11, result2, result22, result3, result33, result4, result44
    });
    /*console.log(new Date(today.setDate(today.getDate() - 1)));
    console.log(new Date());
    console.log(new Date(today.setDate(today.getDate() - 6)));
    console.log(new Date());
    console.log(new Date(today.setDate(today.getDate() - 21)));
    console.log(new Date());
    console.log(new Date(today.setDate(today.getDate() - 62)));
    console.log(new Date());
    res.send('ok');*/
}
function yyyymmdd(now) {

    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    return '' + y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}
//console.log('essai =' + yyyymmdd(new Date()))
var http = require('http')
function getJSON(options, cb) {
    http.request(options, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var result = JSON.parse(body);
            cb(null, result);
        });
        res.on('error', cb);
    })
        .on('error', cb)
        .end();
}
var options = {
    host: '127.0.0.1',
    port: 5000,
    path: '/test',
    method: 'GET'
};

var schedule = require('node-schedule');
var executePredictionSaveValues = schedule.scheduleJob('35 07 * * *', function () {
    getJSON(options, function (err, result) {
        if (err) {
            return console.log('error ', err);
        }
        console.log(result);
    });
});
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
    extra_work_atHome: extra_work_atHome,
    extra_work_atHome_note: extra_work_atHome_note,
    //isWeekEnd: isWeekEnd,
    duration_perUSer_Punctuality: duration_perUSer_Punctuality,
    user_punctualityNote_stats: user_punctualityNote_stats,
    motivation_note: motivation_note
    /*real_duration: real_duration,
   */
};
