const DayOff = require('../models/DayOffs');
const Absenteeisme = require('../models/Absenteeisme');
const Conn_Location = require('../models/ConnectionLocation');
const connLocationUtils = require('../utils/connLocation');

var conn_duration = connLocationUtils.conn_duration;
var getConnectionsPerUser = connLocationUtils.getConnectionsPerUser;


function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}

function atCompany(connection_location) {
    var beSoftilisLong = 10.3060056;
    var beSoftilisLat = 36.829325;


    var long = connection_location.longitude;
    var lat = connection_location.latitude;
    var dist = distance(lat, long, beSoftilisLat, beSoftilisLong, "K");

    if (dist < 0.1)
        return true;
    return false;

}
/* console.log(atCompany({

    longitude: 10.306619,
    latitude: 36.829096,
})); */



function isWeekEnd(date) {
    if (date.getDay() == 0 || date.getDay() == 6)
        return true;
    return false;
}
async function isDayOff(date, userID) {
    var is_day_off;
    await DayOff.findOne({ _user: userID, date: date }).then((data) => {
        if (data)
            is_day_off = true;
        else
            is_day_off = false;
    }).catch(error =>
        console.log(error));
    return is_day_off;
}
async function isAbsent(date, userID) {
    var is_absent;
    await Absenteeisme.findOne({ _user: userID, date: date }).then((data) => {
        if (data)
            is_absent = true;
        else
            is_absent = false;
    }).catch(error =>
        console.log(error));
    return is_absent;

}
async function isPonctual(date, userID) {
    var is_ponctual_in = false;
    var is_ponctual_out = false;
    var check_date_morning = new Date(date);
    check_date_morning.setHours(9);
    var check_date_evening = new Date(date);
    check_date_evening.setHours(17);
    await Conn_Location.find({
        connectedAt: { "$lte": check_date_morning.setMinutes(15), "$gte": check_date_morning.setMinutes(0) },
        _user: userID
    }).then((data) => {
        if (data) {
            for (let d of data) {
                if (atCompany(d))
                    is_ponctual_in = true;
            }
        }

        else
            is_ponctual_in = false;
    }).catch(error =>
        console.log(error));

    await Conn_Location.find({
        disconnectedAt: { "$lte": check_date_evening.setMinutes(15), "$gte": check_date_evening.setMinutes(0) },
        _user: userID
    }).then((data) => {
        if (data) {
            for (let d of data) {
                if (atCompany(d))
                    is_ponctual_out = true;
            }
        }
        else
            is_ponctual_out = false;
    }).catch(error =>
        console.log(error));
    // console.log(is_ponctual_in);
    if (is_ponctual_in && is_ponctual_out)
        return true;
    return false;
}
async function real_duration(date_start, date_end) {
    var date_debut = new Date(date_start);
    var duration = 0;
    while (date_debut <= date_end) {
        if (!(await isWeekEnd(date_debut))) {
            duration++;
        }
        date_debut.setDate(date_debut.getDate() + 1);
    }
    return duration;
}
async function duration_perUSer_Punctuality(date_start, date_end, userID) {
    var date_debut = new Date(date_start);
    //console.log('debut' + date_debut);
    var duration = 0;
    while (date_debut <= date_end) {
        if (!(await isDayOff(date_debut, userID)) && !(await isWeekEnd(date_debut)) && !(await isAbsent(date_debut, userID))) {
            duration++;
        }
        date_debut.setDate(date_debut.getDate() + 1);
    }
    console.log('duration =' + duration);
    return duration;
}
async function punctualityWithDates(date_start, date_end, userID) {
    var punctuality_Per_Period = {};
    var date_debut = new Date(date_start);
    var nbDays = 0;
    let dates = [];
    while (date_debut <= date_end) {
        if (await isPonctual(date_debut, userID)) {
            nbDays++;
            let d = new Date(date_debut);
            dates.push(d);
        }
        date_debut.setDate(date_debut.getDate() + 1);
    }
    punctuality_Per_Period = { 'dates': dates, 'number_Of_Days_Punctual': nbDays };
    return punctuality_Per_Period;

}
async function punctualityDaysNumberPerDuration(date_start, date_end, userID) {
    var date_debut = new Date(date_start);
    var nbDays = 0;
    while (date_debut <= date_end) {
        if (await isPonctual(date_debut, userID)) {
            nbDays++;
        }
        date_debut.setDate(date_debut.getDate() + 1);
    }
    return nbDays;
}

async function dayoffWithDates(date_start, date_end, userID) {
    var dayoffs = {};
    let dates = [];
    var date_debut = new Date(date_start);
    var number_of_dayoffs = 0;
    while (date_debut <= date_end) {
        if (await isDayOff(date_debut, userID)) {
            number_of_dayoffs++;
            let dd = new Date(date_debut);
            dates.push(dd);

        }
        date_debut.setDate(date_debut.getDate() + 1);

    }
    dayoffs = { 'dates': dates, 'number_Of_dayOffs': number_of_dayoffs };
    return dayoffs;

}

async function userPunctualityNotePerDuration(date_start, date_end, userID) {
    var note = (await punctualityDaysNumberPerDuration(date_start, date_end, userID) / await duration_perUSer_Punctuality(date_start, date_end, userID)) * 10;
    return note;
}
function insertDayOff(req, res) {
    day_off = new DayOff({
        date: req.params.date,
        _user: req.params.id
    });
    day_off.save().then(data => {
        res.status(200).json(data);

    }).catch(error => {
        res.status(500).json(error)
    });
}
async function countDayOff(date_start, date_end, userID) {
    var date_debut = new Date(date_start);
    var number_of_dayoffs = 0;
    while (date_debut <= date_end) {
        console.log(date_debut);
        /*console.log('lvl1')
        console.log(await isDayOff(date_debut, userID))*/
        if (await isDayOff(date_debut, userID)) {
            number_of_dayoffs++;
            console.log(number_of_dayoffs);
        }
        date_debut.setDate(date_debut.getDate() + 1);
    }
    return number_of_dayoffs;
}
async function dayOffNote(date_start, date_end, userID) {

    var note = 10 - (await countDayOff(date_start, date_end, userID) / await real_duration(date_start, date_end)) * 10;
    console.log(await countDayOff(date_start, date_end, userID));
    console.log(await real_duration(date_start, date_end));
    return note;
}
async function extraWorkAtHomeNote(date_start, date_end, userID) {
    let ew = {};
    ew = await extraWorkAtHome(date_start, date_end, userID);
    let connDuration = ew.connectionsDuration;
    let period = (date_end - date_start) / (3600000 * 24) * 60;
    console.log('period : ' + period);
    console.log('connDuration :' + connDuration);
    let note = Number((connDuration / period) * 10).toFixed(1);
    console.log('note :' + note);
    if (note > 10) {
        note = 10;
    }
    return note;
}
async function extraWorkAtHome(date_start, date_end, userID) {
    var extraworkObject = {};
    var ConnArray = [];
    var duree = 0;
    await getConnectionsPerUser(date_start, date_end, userID).then(data => {
        ConnArray = data.filter(con =>
            (!atCompany(con) && conn_duration(con) > 15)
        );
        ConnArray.forEach(con => {
            duree += conn_duration(con);
        });
    }).catch(err => {
    });

    extraworkObject = { connectionsDuration: duree, connections: ConnArray }
    return extraworkObject;
}
module.exports = {
    isPonctual: isPonctual,
    isAbsent: isAbsent,
    isDayOff: isDayOff,
    atCompany: atCompany,
    isWeekEnd: isWeekEnd,
    duration_perUSer_Punctuality: duration_perUSer_Punctuality,
    real_duration: real_duration,
    userPunctualityNotePerDuration: userPunctualityNotePerDuration,
    punctualityDaysNumberPerDuration: punctualityDaysNumberPerDuration,
    punctualityWithDates: punctualityWithDates,
    insertDayOff: insertDayOff,
    countDayOff: countDayOff,
    dayOffNote: dayOffNote,
    dayoffWithDates: dayoffWithDates,
    extraWorkAtHome: extraWorkAtHome,
    extraWorkAtHomeNote: extraWorkAtHomeNote
}

