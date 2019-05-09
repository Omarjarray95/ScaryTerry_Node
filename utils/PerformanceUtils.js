var Sprint = require('../models/Sprint');
var UserStory = require('../models/UserStory');
var com_utils = require('../utils/CommunicationNote')
var getmeetingNoteByCriteria = com_utils.getmeetingNoteByCriteria;
async function getTechnicalPerformanceNote(imp, type, from, to, userID, cb) {

    let arr = [];
    let mark = 5;
    arr = await getmeetingNoteByCriteria(imp, type, from, to, userID);
    arr.forEach(data => {

        mark += data.note;
        console.log('mm' + mark);
    });
    if (mark > 10)
        cb(10);
    else if (mark < 0)
        cb(0);
    else
        cb(mark);
}

function yyyymmdd(now) {

    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    return '' + y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}
module.exports = {
    getTechnicalPerformanceNote: getTechnicalPerformanceNote
}