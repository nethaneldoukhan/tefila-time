const https = require('https');
const debug = require('debug')('app:getParasha');
const KosherZmanim = require('kosher-zmanim');
const pagesFunctions = require('./pagesFunctions');

var optionZmanimShabbat = {};

async function zmanimShabbat(zmanim) {
    optionZmanimShabbat = zmanim.optionZmanim;
    const parasha = await getParasha(zmanim);
    const shabbatTime = getShabbatDate();
    getShabbatParasha(parasha, zmanim, shabbatTime);
    optionZmanimShabbat.date = shabbatTime;
    const shabbatKosherZmanim = KosherZmanim.getZmanimJson(optionZmanimShabbat);
    zmanim.kosherZmanim.shabbat = shabbatKosherZmanim;
    saveZmanim(shabbatKosherZmanim, zmanim);
    return zmanim;
}


function getParasha(zmanim) {
    let loc = 0;
    if (zmanim.israel) {
        loc = 281184;
    } else {
        loc = 3448439;
    }
    let year = zmanim.date.slice(0, 4);
    let month = zmanim.date.slice(5, 7);
    let day = zmanim.date.slice(8, 10);
    return new Promise((resolve, reject) => {
        const option = {
            hostname: 'hebcal.com',
            path: `/shabbat/?cfg=json&geonameid=${loc}&m=50&gy=${year}&gm=${month}&gd=${day}` // sao poalo 3448439. jerusalem 281184	
            };
        const request = https.get(option, (response) => {
            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                const data = JSON.parse(body);
                resolve(data);
            });
        });
        request.end();
    });
}

function getShabbatParasha(parasha, zmanim, shabbatTime) {
    parasha.items.forEach(item => {
        if (item.category == 'parashat') {
            zmanim.parasha = item.hebrew;
        }
    });
    if (!zmanim.parasha) {
        parasha.items.forEach(item => {
            if (item.category == 'holiday' && item.date == shabbatTime) {
                zmanim.parasha = item.hebrew;
            }
        });
    }
}

function saveZmanim(kosherZmanim, zmanim) {
    let zmanimShabbatArray =
    [
        {
            link: kosherZmanim.BasicZmanim.CandleLighting,
            name: 'ה"נ',
            time: ''
        },
        {
            link: kosherZmanim.BasicZmanim.Tzais,
            name: 'מוצ"ש',
            time: ''
        },
        {
            link: kosherZmanim.BasicZmanim.Tzais72,
            name: 'ר"ת',
            time: ''
        }
    ];
    zmanimShabbatArray.forEach(item => {
        const time = item.link.slice(11, 16);
        item.time = time;
    });
    zmanim.zmanimShabbat = zmanimShabbatArray;
}

function getShabbatDate() {
    const nowDate = new Date();
    const formats = {weekday: "short"};
    let weekDay = nowDate.toLocaleDateString("en", formats);
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
    return shabbatDate;
}

module.exports = zmanimShabbat;