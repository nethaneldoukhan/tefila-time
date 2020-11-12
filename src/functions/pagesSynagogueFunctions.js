const fs = require('fs');
const debug = require('debug')('app:pagesSynagogueFunctions');
const { MongoClient, ObjectID } = require('mongodb');
const Synagogue = require('../schemas/SynagogueSchema');
const Tribunal = require('../schemas/TribunalSchema');
const Cours = require('../schemas/CoursSchema');
const WeekTefila = require('../schemas/WeekTefilaSchema');
const ShabbatTefila = require('../schemas/ShabbatTefilaSchema');
const zmanimFunction = require('../functions/zmanim');
const pagesFunctions = require('../functions/pagesFunctions');

                    
async function getSynagogueData(id) {
    try {
        let detail = await Synagogue.collection.findOne({ _id: new ObjectID(id)});
        detail.lastUpdateDate = formatDate(detail.lastUpdateDate);
        detail.rite = nameRite(detail.rite);
        const data = await getData(id);
        let getSynagogueZmanim = await zmanimFunction.getZmanim(new Date(), detail.city.toLowerCase(), detail.country.toLowerCase(), 'week');
        const shabbatDate = pagesFunctions.getShabbatDate();
        const getSynagogueZmanimShabbat = await zmanimFunction.getZmanim(shabbatDate, detail.city.toLowerCase(), detail.country.toLowerCase(), 'shabbat');
        debug(getSynagogueZmanimShabbat);
        // getSynagogueZmanim.kosherZmanim.shabbat = getSynagogueZmanimShabbat.kosherZmanim.shabbat;
        getSynagogueDayTime(data, getSynagogueZmanim);
        return {'detail': detail, 'data': data};
    } catch(err) {
        debug('error SynagoguePageFuntions', err);
    }
}

async function getData(id) {
    let synagogueData = {
        'tefilot': 
            [
                await WeekTefila.collection.find({ synagogueId: id, tefilaType: '1' }).toArray(),
                await WeekTefila.collection.find({ synagogueId: id, tefilaType: '2' }).toArray(),
                await WeekTefila.collection.find({ synagogueId: id, tefilaType: '3' }).toArray(),
                await ShabbatTefila.collection.find({ synagogueId: id, tefilaType: '4' }).toArray(),
                await ShabbatTefila.collection.find({ synagogueId: id, tefilaType: '5' }).toArray(),
                await ShabbatTefila.collection.find({ synagogueId: id, tefilaType: '6' }).toArray(),
                await ShabbatTefila.collection.find({ synagogueId: id, tefilaType: '7' }).toArray()
            ],
        'messages': [
            // await Message.collection.find({ synagogueId: id, messageType: '1' }).toArray(),
            // await Message.collection.find({ synagogueId: id, messageType: '2' }).toArray()
        ],
        'siha': {

        }
    };
    return synagogueData;
}

function getSynagogueDayTime(synagogueData, synagogueZmanim) {
        synagogueData.tefilot.forEach(item => {
            item.forEach(item => {
                if(item.hour_day_time) {
                    let weekDay = '';
                    if (item.tefilaType < 4) {
                        weekDay = 'week';
                    } else {
                        weekDay = 'shabbat';
                    }
                    const calcs = getBtnCalc(item.day_hours, synagogueZmanim, weekDay);
                    item.hour = calcDayTime(calcs.day_hour, item.hour_day_time, calcs.btn);
                    item.day_hours = calcs.day_hours;
                }
                if (item.days) {
                    item.days = nameDays(item.days);
                }
            });
            sortItem(item, 'hour');
        });
}

function sortItem(array, key) {
    array.sort(function(a, b) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    });
}

function getBtnCalc(day_hour, synagogueZmanim, weekDay) {
    let calcs = {
        'btn': '',
        'day_hour': '',
        'day_hours': ''
    };
    if(day_hour == 1) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.SeaLevelSunrise.slice(11, 16);
        // calcs.day_hour = '06:10';
        calcs.day_hours = ' לפני הנץ החמה';
    } else if(day_hour == 2) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.CandleLighting.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' לפני הדלקת נירות';
    } else if(day_hour == 3) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.CandleLighting.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' אחרי הדלקת נירות';
    } else if(day_hour == 4) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.MinchaGedola.slice(11, 16);
        // calcs.day_hour = '12:33';
        calcs.day_hours = ' אחרי מנחה גדולה';
    } else if(day_hour == 5) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.PlagHamincha.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' לפני פלג המנחה';
    } else if(day_hour == 6) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.PlagHamincha.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' אחרי פלג המנחה';
    } else if(day_hour == 7) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.Sunset.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' לפני השקיעה';
    } else if(day_hour == 8) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.Sunset.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' אחרי השקיעה';
    } else if(day_hour == 9) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.Tzais.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' אחרי צאת הכוכבים';
    } else if(day_hour == 10) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.Tzais72.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' אחרי ר"ת';
    }
    return calcs;
}

function calcDayTime(dayTime, diffTime, calc) {
    // dayTime = '23:10';
    const minDayTime = convertTimeToMinutes(dayTime);
    // diffTime = '01:50';
    const minDiffTime = convertTimeToMinutes(diffTime);
    let endTimeMin = 0;
    if(calc == '-') {
        endTimeMin = minDayTime - minDiffTime;
    } else {
        endTimeMin = minDayTime + minDiffTime;
    }
    const newTime = convertMinutesToTime(endTimeMin);
    return newTime;
}

function convertTimeToMinutes(time) {
    time = time.split(':');
    const minHoursTime = parseInt(time[0]) * 60;
    const timeToMinutes = parseInt(time[1]) + minHoursTime;
    return timeToMinutes;
}

function convertMinutesToTime(endTimeMin) {
    let hours = Math.floor(endTimeMin / 60);
    let minutes = endTimeMin % 60;
    if(hours < 0) {
        hours = hours - hours - hours;
        hours = 24 - hours;
    }
    if(hours > 24) {
        hours = hours - 24;
    }
    if(minutes < 0) {
        minutes = minutes - minutes - minutes;
        minutes = 60 - minutes;
    }
    const newTime = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);
    // debug({'newTime to synagogue': newTime});
    return newTime;
}

function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function nameRite(rite) {
    if(rite == 1) {
        return 'ע"מ';
    } else if(rite == 2) {
        return 'אשכנז';
    } else if (rite == 3) {
        return 'ספרד';
    }
}

function nameDays(daysArray) {
    let daysString = daysArray.map(function (item) {
            if (item == '1') {
                return 'א';
            } else if (item == '2') {
                return 'ב';
            } else if (item == '3') {
                return 'ג';
            } else if (item == '4') {
                return 'ד';
            } else if (item == '5') {
                return 'ה';
            } else if (item == '6') {
                return 'ו';
        }
    }).join('\'\, ');
    return daysString + '\'\.';
}

module.exports = getSynagogueData;