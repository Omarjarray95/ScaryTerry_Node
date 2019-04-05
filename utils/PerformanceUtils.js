var Sprint = require('../models/Sprint');
var UserStory = require('../models/UserStory');
var com_utils = require('../utils/CommunicationNote')
var getmeetingNoteByCriteria = com_utils.getmeetingNoteByCriteria;
async function getTechnicalPerformanceNote(from, to, userID, cb) {

    let arr = [];
    let mark = 5;
    arr = await getmeetingNoteByCriteria(3, 'technical', from, to, userID);
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
module.exports = { getTechnicalPerformanceNote: getTechnicalPerformanceNote }