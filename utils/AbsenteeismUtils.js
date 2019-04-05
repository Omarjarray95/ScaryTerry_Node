const DayOff = require('../models/DayOffs');
const Absenteeisme = require('../models/Absenteeisme');
const Conn_Location = require('../models/ConnectionLocation');
const motivation_utils = require('../utils/MotivationUtils');
const connection_utils = require('../utils/connLocation');
const user = require('../models/User');
var schedule = require('node-schedule');
var isDayOff = motivation_utils.isDayOff;
var isAbsent = motivation_utils.isAbsent;
var isWeekEnd = motivation_utils.isWeekEnd;
var getConnectionsPerUser = connection_utils.getConnectionsPerUser;
var atCompany = connection_utils.atCompany;

async function addAbsenteeism() {
    let conarray = [];
    let from = new Date();
    from.setHours(1);
    from.setSeconds(0);
    from.setMinutes(0);
    from.setMilliseconds(0);
    from.setDate(from.getDate());
    console.log(from);

    let to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1);
    console.log('to :' + to);
    user.find({}).then(async doc => {
        if (!(await isWeekEnd(from))) {
            console.log('not weekend enter');
            if (doc) {
                console.log('users found enter');
                for (let d of doc) {
                    if (!(await isDayOff(from, d._id)) && !(await isAbsent(from, d._id))) {
                        console.log('is not dayoff and is not absent => enter');
                        await getConnectionsPerUser(from, to, d._id).then(async data => {
                            conarray = data.filter(con =>
                                atCompany(con)
                            );
                        }).catch(err => {
                        });
                        console.log('filterX :' + conarray);
                        if (conarray.length == 0) {
                            let absenteeisme = new Absenteeisme({
                                date: from,
                                _user: d._id
                            });
                            absenteeisme.save().then(abs => {
                                console.log('abs :' + abs);
                            }).catch(error => console.log(error));

                        }
                    }
                }
            }
        }
    }).catch(error => {

    });


}
async function countAbsenteeism(date_start, date_end, userID) {
    var date_debut = new Date(date_start);
    let number_of_absentDays = 0;
    while (date_debut <= date_end) {
        if (await isAbsent(date_debut, userID)) {
            number_of_absentDays++;
        }
        date_debut.setDate(date_debut.getDate() + 1);
    }
    return number_of_absentDays;
}
async function absenteeismNote(date_start, date_end, userID) {

    var note = 10 - (await countAbsenteeism(date_start, date_end, userID) / await motivation_utils.real_duration(date_start, date_end)) * 10;
    return note;
}
var insertABS = schedule.scheduleJob('16 17 * * *', function () {
    addAbsenteeism();
});
async function absenteeismWithDates(date_start, date_end, userID) {
    var absenteeism = {};
    let dates = [];
    var date_debut = new Date(date_start);
    let number_of_absentDays = 0;
    while (date_debut <= date_end) {
        if (await isAbsent(date_debut, userID)) {
            number_of_absentDays++;
            let dd = new Date(date_debut);
            dates.push(dd);

        }
        date_debut.setDate(date_debut.getDate() + 1);

    }
    bsenteeism = { 'dates': dates, 'number_Of_days_absent': number_of_absentDays };
    return bsenteeism;

}

module.exports = {
    addAbsenteeism: addAbsenteeism,
    countAbsenteeism: countAbsenteeism,
    absenteeismNote: absenteeismNote,
    absenteeismWithDates: absenteeismWithDates
}

