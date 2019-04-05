const DayOff = require('../models/DayOffs');
const Absenteeisme = require('../models/Absenteeisme');
const Conn_Location = require('../models/ConnectionLocation');
var mongoose = require('mongoose');


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
    console.log("data " + connection_location);

    var long = connection_location.longitude;
    var lat = connection_location.latitude;
    var dist = distance(lat, long, beSoftilisLat, beSoftilisLong, "K");
    console.log(dist);
    if (dist < 0.1)
        return true;
    return false;

}
/* console.log(atCompany({

    longitude: 10.306619,
    latitude: 36.829096,
})); */


function punctualityWithDates(date_start, date_end, userID) {
    var punctuality_Per_Period = {};
    var date_debut = date_start;
    var nbDays = 0;
    var dates = [];
    while (date_debut <= date_end) {
        if (!(isDayOff(date_debut, userID)) && !(isWeekEnd(date_debut)) && !(isAbsent(date_debut, userID)) && isPonctual(date_debut, userID)) {
            nbDays++;
            dates.push(date_debut);
        }
        date_debut.setDate(date_debut.getDate() + 1);
    }
    punctuality_Per_Period = { 'dates': dates, 'number_Of_Days_Punctual': nbDays };


}
function punctualityDaysNumberPerDuration(date_start, date_end, userID) {
    var date_debut = date_start;
    var nbDays = 0;
    while (date_debut <= date_end) {
        if (!(isDayOff(date_debut, userID)) && !(isWeekEnd(date_debut)) && !(isAbsent(date_debut, userID)) && isPonctual(date_debut, userID)) {
            nbDays++;
        }
        date_debut.setDate(date_debut.getDate() + 1);
    }
    return nbDays;
}
function absenteeismeNote() {

}
function dayoffsfncts4(date_start, date_end, userID) {
    var date_debut = date_start;
    var number_of_dayoffs = 0;
    while (date_debut <= date_end) {
        if (isDayOff(date_debut, userID)) {
            number_of_dayoffs++;
        }
        date_debut.setDate(date_debut.getDate() + 1);
    }
    return number_of_dayoffs;

}

function userPunctualityNotePerDuration(date_start, date_end, userID) {
    var note = (punctualityDaysNumberPerDuration(date_start, date_end, userID) / real_duration_perUSer(date_start, date_end, userID)) * 10;
    return note;
}
function real_duration(date_start, date_end) {
    var date_debut = date_start;
    var duration = 0;
    while (date_debut <= date_end) {
        if (!(isWeekEnd(date_debut))) {
            duration++;
        }
        date_debut.setDate(date_debut.getDate() + 1);
    }
    return duration;
}
function real_duration_perUSer(date_start, date_end, userID) {
    var date_debut = date_start;
    var duration = 0;
    while (date_debut <= date_end) {
        if (!(isDayOff(date_debut, userID)) && !(isWeekEnd(date_debut))) {
            duration++;
        }
        date_debut.setDate(date_debut.getDate() + 1);
    }
    return duration;
}
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
    var is_ponctual_in;
    var is_ponctual_out;
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
    console.log(is_ponctual_in);
    if (is_ponctual_in && is_ponctual_out)
        return true;
    return false;
}
async function getConnectionsPerUser(date_start, date_end, userID) {
    var from = new Date(date_start);
    var to = new Date(date_end);
    var connectionsList = [];
    await Conn_Location.find({
        connectedAt: { "$lte": to, "$gte": from },
        _user: userID
    }).then((data) => {
        if (data)
            connectionsList = data;
    }).catch((error) => {
        console.log(error);
    });
    return connectionsList;
}
function conn_duration(con_loc) {
    return (con_loc.disconnectedAt - con_loc.connectedAt) / 60000;
}

/*await Conn_Location.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "_user",
            foreignField: "_id",
            as: "users"
        }
    },
    {
        $match: { users: { $elemMatch: { _id: mongoose.Types.ObjectId('5c926640db149e155096dfa9') } } }
    }

]).then(data => {
    console.log(data)
}).catch(err => {
    console.log(err)
});

return 0;*/

module.exports = {
    isPonctual: isPonctual,
    getConnectionsPerUser: getConnectionsPerUser,
    atCompany: atCompany,
    conn_duration: conn_duration
}

