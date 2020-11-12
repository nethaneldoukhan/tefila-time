const debug = require('debug')('app:pagesFunctions');
const Synagogue = require('../schemas/SynagogueSchema');
const zmanimFunction = require('./zmanim');
const manageCookies = require('./manageCookies');


async function getAllZmanim(req, res) {
    const nowDate = new Date();
    const shabbatDate = getShabbatDate();
    let zmanim = {};
    try {
        const checkCookies = manageCookies.checkCookies(req);
        if (checkCookies.status == 0) {
            zmanim = await zmanimFunction.getZmanim(nowDate, checkCookies.cookiesValues.city.toLowerCase(), checkCookies.cookiesValues.country.toLowerCase(), 'week');
            zmanim = await zmanimFunction.getZmanim(shabbatDate, checkCookies.cookiesValues.city.toLowerCase(), checkCookies.cookiesValues.country.toLowerCase(), 'shabbat');
            debug(zmanim);
            } else {
            zmanim = await zmanimFunction.getZmanim(nowDate, 'jerusalem', 'israel', 'week');
            zmanim = await zmanimFunction.getZmanim(nowDate, 'jerusalem', 'israel', 'shabbat');
            manageCookies.addCookies(zmanim, req, res);
        }
        zmanim.parasha = await zmanimFunction.getShabbatParasha(zmanim.week.israel, shabbatDate);        
        return zmanim;
    } catch (e) {
        debug(e);
    }
}

function userDiv(req) {
    let htmlData  = {};
    if (req.user) {
        htmlData = {
            'nav': `<a href="/account" class="col-blu">
                        <i class="fas fa-user-alt"></i>
                        שלום ${req.user.firstName}
                    </a>`,
            'connexion':  `<nav>
                                <div>   
                                    <span class="btn-user_command fs-20 pad15 col-blu c-blu_h point menu1">
                                        <i class="fas fa-user-alt"></i>
                                        ${req.user.firstName}
                                        <i class="fas fa-chevron-down marR-20"></i>
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
    
    let panoramicArray = await Synagogue.collection.find({"panoramic": { "$ne": "" }}).toArray();
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
    areaData.push(panoramicArray[area1], panoramicArray[area2], panoramicArray[area3]);
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
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.SeaLevelSunrise.slice(11, 16);
        calcs.day_hours = ' לפני הנץ החמה';
    } else if(day_hour == 2) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.CandleLighting.slice(11, 16);
        calcs.day_hours = ' לפני הדלקת נירות';
    } else if(day_hour == 3) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.CandleLighting.slice(11, 16);
        calcs.day_hours = ' אחרי הדלקת נירות';
    } else if(day_hour == 4) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.MinchaGedola.slice(11, 16);
        calcs.day_hours = ' אחרי מנחה גדולה';
    } else if(day_hour == 5) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.PlagHamincha.slice(11, 16);
        calcs.day_hours = ' לפני פלג המנחה';
    } else if(day_hour == 6) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.PlagHamincha.slice(11, 16);
        calcs.day_hours = ' אחרי פלג המנחה';
    } else if(day_hour == 7) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.Sunset.slice(11, 16);
        calcs.day_hours = ' לפני השקיעה';
    } else if(day_hour == 8) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.Sunset.slice(11, 16);
        calcs.day_hours = ' אחרי השקיעה';
    } else if(day_hour == 9) {
        calcs.btn = '+';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.Tzais.slice(11, 16);
        calcs.day_hours = ' אחרי צאת הכוכבים';
    } else if(day_hour == 10) {
        calcs.btn = '-';
        calcs.day_hour = synagogueZmanim[weekDay].kosherZmanim.BasicZmanim.Tzais72.slice(11, 16);
        calcs.day_hours = ' אחרי ר"ת';
    }
    return calcs;
}

function calcDayTime(dayTime, diffTime, calc) {
    const minDayTime = convertTimeToMinutes(dayTime);
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