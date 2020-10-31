const https = require('https');
const qs = require("querystring");
const fs = require('fs');
const express = require('express');
const adminRouter = express.Router();
const debug = require('debug')('app:getZmanim');
const {MongoClient,ObjectID} = require('mongodb');
const City = require('../schemas/CitySchema');
const KosherZmanim = require("kosher-zmanim");
const getZmanimJson = require('kosher-zmanim');   
const { ifError } = require('assert');

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

var kosherZmanim = '';

var zmanim = {
    'date': '',
    'location': {'city': '', 'country': ''},
    'israel': false,
    'optionZmanim': {},
    'hours': [],
    'parasha': '',
    'zmanimShabbat': '',
    'kosherZmanim': ''
};

async function getZmanim(date, city, country) {
    debug(date, city, country);

    try {
        optionZmanim.date = date;
        zmanim.location.city = city;
        zmanim.location.country = country;

        // let cityDetails = await City.collection.findOne({ 'city': cityArray[0], 'country': cityArray[1]});
        // if (cityDetails) {
        //     debug(cityDetails);
        // } else {
            const longAndLat = await getLatAndLong(city, country);
            await getElevation(longAndLat);
            await getTimeZone(longAndLat);
            const checkExistEn = await City.collection.findOne({ 'countryNameEn': newCity.countryNameEn, 'countryNameEn': newCity.countryNameEn});
            if (checkExistEn) {
                City.collection.collection.findOneAndUpdate({ 'countryNameEn': newCity.countryNameEn, 'countryNameEn': newCity.countryNameEn}, { "$push": { "cityNames": city, 'countryNames': country }});
            } else if (!newCity.cityNames.includes(city) && !newCity.countryNames.includes(country)) {
                newCity.cityNames.push(city);
                newCity.countryNames.push(country);
                const results = await City.collection.insertOne(newCity);
                debug(results.ops[0]);
            } else {
                debug('new city names exist');
            }
            debug(newCity);
            zmanim.optionZmanim = optionZmanim;
            kosherZmanim = KosherZmanim.getZmanimJson(optionZmanim);
            debug(kosherZmanim);
            saveZmanim(kosherZmanim);
            debug(zmanim);
            return zmanim;
        } catch (e) {
        debug(e);
        return e;
    }
}

function saveZmanim(kosherZmanim) {
    zmanim.kosherZmanim = kosherZmanim;
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
        debug(time);
        item.time = time;
    });
    zmanim.date = kosherZmanim.metadata.date;
    zmanim.hours = zmanimArray;
}
    
    
function getLatAndLong(city, country) {
    let cityUrl = encodeURIComponent(city + ', ' + country);
    debug(city);
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
                debug(JSON.parse(body));
                const data = JSON.parse(body).results[0];
                let countryData = data.formatted_address.toLowerCase();
                debug(countryData);
                if (countryData.includes('israel')){
                    zmanim.israel = true;
                }
                const longAndLat = data.geometry.location;
                debug(longAndLat);
                let locData = data.address_components;
                if (data.types.includes('locality')) {
                    debug(999);
                } else {
                    reject(9);
                }
                let loc = {
                    'city': '',
                    'country': ''
                };
                locData.forEach(item => {
                    if (item.types.includes('locality')) {
                        loc.city = item.long_name.toLowerCase();
                    } else if (item.types.includes('country')) {
                        loc.country = item.long_name.toLowerCase();
                    }
                });
                debug(loc);
                optionZmanim.locationName = data.address_components[0].long_name;
                optionZmanim.latitude = data.geometry.location.lat;
                optionZmanim.longitude = data.geometry.location.lng;
                
                newCity.cityNameEn = loc.city;
                newCity.countryNameEn = loc.country;
                newCity.cityNames.push(loc.city);
                newCity.countryNames.push(loc.country);
                newCity.latitude = data.geometry.location.lat;
                newCity.longitude = data.geometry.location.lng;
                resolve(longAndLat);
            });
        });
        request.end();
    });
}

function getTimeZone(longAndLat) {
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
                debug(data);
                optionZmanim.timeZoneId = data.timezone;
                newCity.timeZoneId = data.timezone;
                resolve();
            });
        });
        request.end();
    });
}

function getElevation(longAndLat) {
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
                debug(elevation);
                
            if (elevation < 0) {
                elevation = 0;
            }
                optionZmanim.elevation = elevation;
                newCity.elevation = elevation;
                resolve();
            });
        });
        request.end();
    });
}

module.exports = getZmanim;