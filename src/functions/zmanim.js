const https = require('https');
const debug = require('debug')('app:zmanim');
const City = require('../schemas/CitySchema');
const KosherZmanim = require('kosher-zmanim');
const manageJson = require('./manageJson');

var newCity = {
    'cityNameEn': '',
    'countryNameEn': '',
    'cityNames': [],
    'countryNames': [],
    'timeZoneId': '',
    'latitude': 0,
    'longitude': 0,
    'elevation': 0
}

var optionZmanim = {
    date: '',
    timeZoneId: '',
    locationName: '',
    latitude: 0,
    longitude: 0,
    elevation: 0,
    complexZmanim: false
};


var zmanim = {
    'week': {
        'date': '',
        'location': {'city': '', 'country': ''},
        'israel': '',
        'optionZmanim': {},
        'hours': [],
        'kosherZmanim': {}
    },
    'shabbat': {
        'date': '',
        'location': {'city': '', 'country': ''},
        'israel': '',
        'optionZmanim': {},
        'hours': [],
        'kosherZmanim': {}
    }
};

async function getZmanim(date, city, country, weekDay) {
    debug(date, city, country);
    try {
        optionZmanim.date = date;
        zmanim[weekDay].location.city = city;
        zmanim[weekDay].location.country = country;
        await getCityData(city, country, weekDay);
        zmanim[weekDay].optionZmanim = optionZmanim;
        const getKosherZmanim = KosherZmanim.getZmanimJson(optionZmanim);
        zmanim[weekDay].kosherZmanim = getKosherZmanim;
        if (weekDay == 'week') {
            saveWeekZmanim(getKosherZmanim, weekDay);
        }
        if (weekDay == 'shabbat') {
            saveShabbatZmanim(getKosherZmanim, weekDay);
        }
        return zmanim;
    } catch (e) {
        debug(e);
        return e;
    }
}

async function getCityData(city, country, weekDay) {
    let status = await getDatafromDb(city, country, weekDay);
    if (!status) {
        await getDatafromNet(city, country, weekDay);
    }
}

async function getDatafromDb(city, country, weekDay) {
    let cityDetails = await City.collection.findOne({
        '$and': [{
            'cityNames': {'$in': [ city ] }
        }, {
            'countryNames': { '$in': [ country ] }
        }]});
    debug('cityDetail', cityDetails);
    if (cityDetails) {
        if (cityDetails.countryNames.includes('israel')){
            zmanim[weekDay].israel = 'israel';
        } else {
            zmanim[weekDay].israel = 'diaspora';
        }
        optionZmanim.locationName = city;
        optionZmanim.latitude = cityDetails.latitude;
        optionZmanim.longitude = cityDetails.longitude;
        optionZmanim.elevation = cityDetails.elevation;
        optionZmanim.timeZoneId = cityDetails.timeZoneId;
        return true;
    } else {
        return false;
    }
}

async function getDatafromNet(city, country, weekDay) {
    const dataCity = await getLatAndLong(city, country);
    const elevation = await getElevation(dataCity);
    const timeZone = await getTimeZone(dataCity);
    setDataToVars(dataCity, elevation, timeZone, weekDay);
    updateCitiesDb(city, country);
}

function saveWeekZmanim(kosherZmanim, weekDay) {
    let zmanimArray =
        [
            {
                link: kosherZmanim.BasicZmanim.AlosHashachar,
                name: 'עלות השחר',
                time: ''
            },
            {
                link: kosherZmanim.BasicZmanim.SeaLevelSunrise,
                name: 'הנץ החמה',
                time: ''
            },
            {
                link: kosherZmanim.BasicZmanim.SofZmanShmaMGA,
                name: 'סו"ז ק"ש מ"א',
                time: ''
            },
            {
                link: kosherZmanim.BasicZmanim.SofZmanShmaGRA,
                name: 'סו"ז ק"ש גר"א',
                time: ''
            },
            {
                link: kosherZmanim.BasicZmanim.SofZmanTfilaMGA,
                name: 'סוז"ת מ"א',
                time: ''
            },
            {
                link: kosherZmanim.BasicZmanim.SofZmanTfilaGRA,
                name: 'סוז"ת גר"א',
                time: ''
            },
            {
                link: kosherZmanim.BasicZmanim.Chatzos,
                name: 'חצות',
                time: ''
            },
            {
                link: kosherZmanim.BasicZmanim.MinchaGedola,
                name: 'מנחה גדולה',
                time: ''
            },
            {
                link: kosherZmanim.BasicZmanim.Sunset,
                name: 'שקיעה',
                time: ''
            },
            {
                link: kosherZmanim.BasicZmanim.Tzais,
                name: 'צאת הכוכבים',
                time: ''
            },
        ];
    zmanimArray.forEach(item => {
        const time = item.link.slice(11, 16);
        item.time = time;
    });
    zmanim[weekDay].date = kosherZmanim.metadata.date;
    zmanim[weekDay].hours = zmanimArray;
}

function saveShabbatZmanim(kosherZmanim, weekDay) {
    let zmanimArray =
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
        zmanimArray.forEach(item => {
        const time = item.link.slice(11, 16);
        item.time = time;
    });
    zmanim[weekDay].date = kosherZmanim.metadata.date;
    zmanim[weekDay].hours = zmanimArray;
}

async function getShabbatParasha(loc, shabbatDate) {
    const shabbatJson = await manageJson.readJson('parashiot.json');
    let parasha = '';
    const arrayThisWeek = shabbatJson[loc].items.filter(item => {
        return item.date == shabbatDate;
    });
    debug(arrayThisWeek);
    arrayThisWeek.forEach(item => {
        if (item.category == 'parashat') {
            parasha = item.hebrew;
        }
    });
    if (!parasha) {
        parasha.items.forEach(item => {
            if (item.category == 'holiday' && item.date == shabbatTime) {
                parasha = item.hebrew;
            }
        });
    }
    return parasha;
}
    
    
function getLatAndLong(city, country) {
    let cityUrl = encodeURIComponent(city + ', ' + country);
    return new Promise((resolve, reject) => {
        const option = {
            hostname: 'maps.googleapis.com',
            path: `/maps/api/geocode/json?address=${cityUrl}&sensor=true&key=AIzaSyCzixLXCXnqK5EIoh3ydBBzp-0ltX3EhjA`
            };
        const request = https.get(option, (response) => {
            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                const data = JSON.parse(body).results[0];
                if (!data.types.includes('locality')) {
                    reject(9);
                }
                resolve(data);
            });
        });
        request.end();
    });
}

function setDataToVars(dataAndLongAndlat, elevation, timeZone, weekDay) {
    let countryData = dataAndLongAndlat.formatted_address.toLowerCase();
    if (countryData.includes('israel')){
        zmanim[weekDay].israel = 'israel';
    } else {
        zmanim[weekDay].israel = 'diaspora';
    }
    const longAndLat = dataAndLongAndlat.geometry.location;
    optionZmanim.latitude = longAndLat.lat;
    optionZmanim.longitude = longAndLat.lng;
    optionZmanim.elevation = elevation;
    optionZmanim.timeZoneId = timeZone;

    const locData = dataAndLongAndlat.address_components;
    let loc = {
        'city': '',
        'country': ''
    };
    locData.forEach(item => {
        if (item.types.includes('locality')) {
            loc.city = item.long_name.toLowerCase();
            optionZmanim.locationName = item.long_name.toLowerCase();
        } else if (item.types.includes('country')) {
            loc.country = item.long_name.toLowerCase();
        }
    });
    newCity.cityNameEn = loc.city;
    newCity.countryNameEn = loc.country;
    newCity.cityNames.push(loc.city);
    newCity.countryNames.push(loc.country);
    newCity.latitude = longAndLat.lat;
    newCity.longitude = longAndLat.lng;
    newCity.elevation = elevation;
    newCity.timeZoneId = timeZone;
}

function getTimeZone(data) {
    const longAndLat = data.geometry.location;
    return new Promise((resolve, reject) => {
        const option = {
            hostname: 'api.ipgeolocation.io',
            path: `/timezone?apiKey=c07e21aadd7544d9998e763adddeac75&lat=${longAndLat.lat}&long=${longAndLat.lng}`,
        };
        const request = https.get(option, (response) => {
            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                const data = JSON.parse(body);
                resolve(data.timezone);
            });
        });
        request.end();
    });
}

function getElevation(data) {
    const longAndLat = data.geometry.location;
    return new Promise((resolve, reject) => {
        const option = {
            hostname: 'api.jawg.io',
            path: `/elevations?locations=${longAndLat.lat},${longAndLat.lng}&access-token=hwNk2Jkx1r8vekbmfyBtQX737aHwnZTedVBI14LAlctzRYiphYhbPtoju9h4iCQ8`,
        };
        const request = https.get(option, (response) => {
            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                let elevation = JSON.parse(body)[0].elevation;
                
                if (elevation < 0) {
                    elevation = 0;
                }
                resolve(elevation);
            });
        });
        request.end();
    });
}

async function updateCitiesDb(city, country) {
    const checkExistEn = await City.collection.findOne({ 'cityNameEn': newCity.cityNameEn, 'countryNameEn': newCity.countryNameEn});
    if (checkExistEn) {
        let update = {};
        if (!checkExistEn.cityNames.includes(city) && !checkExistEn.countryNames.includes(country)) {
            update = { 'cityNames': city, 'countryNames': country };
        }
        else if (!checkExistEn.cityNames.includes(city)) {
            update = { 'cityNames': city };
        } else if (!checkExistEn.countryNames.includes(country)) {
            update = { 'countryNames': country };
        }
        City.collection.findOneAndUpdate({ 'cityNameEn': newCity.cityNameEn, 'countryNameEn': newCity.countryNameEn}, { "$push": update });
    } else {
        if (!newCity.cityNames.includes(city)) {
            newCity.cityNames.push(city);
        } 
        if (!newCity.countryNames.includes(country)) {
            newCity.countryNames.push(country);
        }
        City.collection.insertOne(newCity);
    }
}

module.exports = {
    getZmanim,
    getShabbatParasha
};