const fs = require('fs');
const debug = require('debug')('app:pagesFunctions');
const Synagogue = require('../schemas/SynagogueSchema');
const getZmanim = require('./getZmanim');
const zmanimShabbat = require('./getParasha');
const manageJson = require('./manageJson');


async function getAllZmanim() {
    const date = new Date();
    let zmanimAndParasha = {};
    try {
        const checkZmanim = await manageJson.checkZmanim(date);
        if (checkZmanim.status == 0) {
            zmanimAndParasha = checkZmanim.zmanimJson;
        } else {
            let zmanim = {};
            if (checkZmanim.status == 1) {
                zmanim = await getZmanim(date, checkZmanim.zmanimJson.location.city.toLowerCase(), checkZmanim.zmanimJson.location.country.toLowerCase(), 'week');
                zmanim = await getZmanim(date, checkZmanim.zmanimJson.location.city.toLowerCase(), checkZmanim.zmanimJson.location.country.toLowerCase(), 'shabbat');
            } else {
                zmanim = await getZmanim(date, 'jerusalem', 'israel', 'week');
                zmanim = await getZmanim(date, 'jerusalem', 'israel', 'shabbat');
            }
            zmanimAndParasha = await zmanimShabbat(zmanim);
            manageJson.addToJson(zmanimAndParasha, 'zmanim.json');
        }
        return zmanimAndParasha;
    } catch (e) {
        debug(e);
    }
}

function userDiv(req) {
    let htmlData  = {};
    if (req.user) {
        htmlData = {
            'nav': `<a href="/account" class="col-r">
                        <i class="fas fa-user-alt"></i>
                        שלום ${req.user.firstName}
                    </a>`,
            'connexion':  `<nav>
                                <div>   
                                    <span class="btn-user_command fs-20 pad15 col-r c-blu_h point menu1">
                                        <i class="fas fa-user-alt"></i>
                                        ${req.user.firstName}
                                    <span>
                                
                                    <ul class="menu2 pad3-0">
                                        <li class="bc-gy-xl_h">
                                            <a href="/account" class="pad10-20 block col-blu">
                                            החשבון שלי
                                            </a>
                                        </li>
                                        <li class="bc-gy-xl_h">
                                            <a href="/auth/logout" class="pad10-20 block col-blu">
                                            יציאה
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>`
        };
    } else {
        htmlData  = {
            'nav': `<a class="col-gy-b account" href="/account">
                    <i class="fas fa-user-alt"></i>
                    החשבון שלי
                </a>`,
            'connexion': `<a href="javascript:void(0)" class="btn-connexion btn-box c-yw_h">
                            <i class="fas fa-lock"></i>
                            התחבר/הרשם
                        </a>`
        };
    }
    return htmlData;
}

async function getSlideArea() {
    
    // debug(synagogues);
    let panoramicArray = await Synagogue.collection.find({"panoramic": { "$ne": "" }}).toArray();
    // debug(panoramicArray);
    const maxRandom = panoramicArray.length;
    let areaData = [];
    if (maxRandom > 0) {
        var area1 = (Math.floor(Math.random() * maxRandom));
        var area2 = area1;
        var area3 = area1;
        while (area2 == area1 && maxRandom > 1) {
            area2 = (Math.floor(Math.random() * maxRandom));
        }
        if (maxRandom > 2) {
            while (area3 == area1 || area3 == area2) {
                area3 = (Math.floor(Math.random() * maxRandom));
            }
        }
    }
    // debug(area1);
    // debug(area2);
    // debug(area3);
    areaData.push(panoramicArray[area1], panoramicArray[area2], panoramicArray[area3]);
    // debug(areaData);
    return areaData;
}

async function getSynagogueHomePage() {
    let synagogues = await Synagogue.collection.find().sort({'createDate': -1}).limit(10).toArray();
    synagogues.forEach(item => {
        if (item.rite == 1) {
            item.rite = 'ע"מ';
        } else if (item.rite == 2) {
            item.rite = 'אשכנז';
        } else if (item.rite == 3) {
            item.rite = 'ספרד';
        }
    });
    return synagogues;
}

function getShabbatDate() {
    const nowDate = new Date();
    const formats = {weekday: "short"};
    let weekDay = nowDate.toLocaleDateString("en", formats);
    debug(weekDay);
    let num = 0;
    switch (weekDay) {
        case 'Sun':
            num = 1;
            break;
        case 'Mon':
            num = 2;
            break;
        case 'Tue':
            num = 3;
            break;
        case 'Wed':
            num = 4;
            break;
        case 'Thu':
            num = 5;
            break;
        case 'Fri':
            num = 6;
            break;
        case 'Sat':
            num = 7;
            break;
    }
    const diffDay = 7 - num;
    const diffHour = diffDay * 86400000;
    let shabbatDateToMilS = new Date(nowDate.getTime() + diffHour);
    const shabbatDay = shabbatDateToMilS.getDate();
    const shabbatMonth = shabbatDateToMilS.getMonth() + 1;
    const shabbatYear = shabbatDateToMilS.getFullYear();
    const shabbatDate = shabbatYear + "-" + ('0' + shabbatMonth).slice(-2) + "-" + ('0' + shabbatDay).slice(-2);
    debug(shabbatDate);
    return shabbatDate;
}

function getBtnCalc(day_hour, synagogueZmanim, weekDay) {
    let calcs = {
        'btn': '',
        'day_hour': '',
        'day_hours': ''
    };
    if(day_hour == 1) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim.kosherZmanim[weekDay].BasicZmanim.SeaLevelSunrise.slice(11, 16);
        // calcs.day_hour = '06:10';
        calcs.day_hours = ' לפני הנץ החמה';
    } else if(day_hour == 2) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim.kosherZmanim[weekDay].BasicZmanim.CandleLighting.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' לפני הדלקת נירות';
    } else if(day_hour == 3) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim.kosherZmanim[weekDay].BasicZmanim.CandleLighting.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' אחרי הדלקת נירות';
    } else if(day_hour == 4) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim.kosherZmanim[weekDay].BasicZmanim.MinchaGedola.slice(11, 16);
        // calcs.day_hour = '12:33';
        calcs.day_hours = ' אחרי מנחה גדולה';
    } else if(day_hour == 5) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim.kosherZmanim[weekDay].BasicZmanim.PlagHamincha.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' לפני פלג המנחה';
    } else if(day_hour == 6) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim.kosherZmanim[weekDay].BasicZmanim.PlagHamincha.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' אחרי פלג המנחה';
    } else if(day_hour == 7) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim.kosherZmanim[weekDay].BasicZmanim.Sunset.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' לפני השקיעה';
    } else if(day_hour == 8) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim.kosherZmanim[weekDay].BasicZmanim.Sunset.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' אחרי השקיעה';
    } else if(day_hour == 9) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim.kosherZmanim[weekDay].BasicZmanim.Tzais.slice(11, 16);
        // calcs.day_hour = '19:17';
        calcs.day_hours = ' אחרי צאת הכוכבים';
    } else if(day_hour == 10) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim.kosherZmanim[weekDay].BasicZmanim.Tzais72.slice(11, 16);
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

function sortItem(array, key) {
    array.sort(function(a, b) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    });
}


module.exports = {
    userDiv,
    getAllZmanim,
    getSlideArea,
    getSynagogueHomePage,
    getShabbatDate,
    getBtnCalc,
    calcDayTime,
    sortItem
    
};