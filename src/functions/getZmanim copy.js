const https = require('https');
const qs = require("querystring");
const fs = require('fs');
const express = require('express');
const adminRouter = express.Router();
const debug = require('DEBUG')('app:getZmanim');
const {MongoClient,ObjectID} = require('mongodb');
const KosherZmanim = require("kosher-zmanim");
const getZmanimJson = require('kosher-zmanim');
const { parse } = require('path');


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
    'location': '',
    'hours': ''
}

async function getZmanim(date, city) {
    debug(date, city);
    try {
        optionZmanim.date = date;
        debug('before refact:', city);
        city = await refactCity(city);
        debug('after refact:', city);
        const wikiId = await getWikiId(city);
        zmanim.location = await getGeoLocal(wikiId);
        refactTimeZone(optionZmanim.timeZoneId);
        await checkElevation();
        zmanim.hours = KosherZmanim.getZmanimJson(optionZmanim);
        return zmanim;
    } catch (e) {
        debug(e);
        return e;
    }
}
    
    
function getWikiId(city) {
    return new Promise((resolve, reject) => {
        const option = {
            hostname: 'en.wikipedia.org',
            path: `/w/api.php?action=query&formatversion=2&prop=pageprops&ppprop=wikibase_item&redirects=1&titles=${city}&format=json`
            };
        const request = https.get(option, (response) => {
            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                const data = JSON.parse(body);
                    debug(data);
                    if (data.query.pages[0].pageprops) {
                    const wikiId = data.query.pages[0].pageprops.wikibase_item;
                    debug(wikiId);
                    resolve(wikiId);
                } else {
                    const notFound = 'העיר לא נמצאת';
                    reject(notFound);
                }
            });
        });
        request.end();
    });
}

function getGeoLocal(wikiId) {
    return new Promise((resolve, reject) => {
        const option = {
            hostname: 'wft-geo-db.p.rapidapi.com',
            path: `/v1/geo/cities/${wikiId}`,
            headers: {
                "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
                "x-rapidapi-key": "c3c0959074mshf523092665bdcd2p1fbc9ajsn23e2d87bee42",
                "useQueryString": true
            }
        };
        const request = https.get(option, (response) => {
            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                const data = JSON.parse(body);
                debug(data);
                if (data.data) {
                    optionZmanim.timeZoneId = data.data.timezone;
                    optionZmanim.locationName = data.data.city;
                    optionZmanim.latitude = data.data.latitude;
                    optionZmanim.longitude = data.data.longitude;
                    optionZmanim.elevation = data.data.elevationMeters

                    debug(optionZmanim);
                    resolve(data);
                } else {
                    const notFound = 'העיר לא נמצאת';
                    reject(notFound);
                }
            });
        });
        request.end();
    });
}

async function checkElevation() {
    if (optionZmanim.elevation === null) {
        debug('Yes');
        await getElevation(optionZmanim.latitude, optionZmanim.longitude);
    } else {
        debug('No');
    }
    if (optionZmanim.elevation < 0) {
        optionZmanim.elevation = 0;
    }
}

function getElevation(latitude, longitude) {
    return new Promise((resolve, reject) => {
        const option = {
            hostname: 'api.jawg.io',
            path: `/elevations?locations=${latitude},${longitude}&access-token=hwNk2Jkx1r8vekbmfyBtQX737aHwnZTedVBI14LAlctzRYiphYhbPtoju9h4iCQ8`,
        };
        debug(latitude, longitude)
        const request = https.get(option, (response) => {
            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                const data = JSON.parse(body);
                debug(data);
                optionZmanim.elevation = data[0].elevation;
                resolve();
            });
        });
        request.end();
    });
}

async function refactCity(city) {
    const hebrewRx = /[\u0590-\u05FF]/;
    if (city.match(hebrewRx)) {
        city = await translateCityToEn(city);
    }
    if (city.includes(' ')) {
        let city1 = '';
        let city2 = '';
        let city3 = '';
        while (city.includes(' ')) {
            let index = city.indexOf(' ');
            debug(index);
            city1 = city.slice(0, index);
            city2 = city.slice(index + 1);
            city3 += city1;
            city = city2;
        }
        city = city3.toLowerCase() + city2.toLowerCase();
    }
    return city;
}

function refactTimeZone(timeZone) {
    const rx = /[.,_!?]/;
    if (timeZone.match(rx)) {
        debug(timeZone.match(rx));
        const index = timeZone.match(rx).index;
        timeZone1 = timeZone.slice(0, index);
        timeZone2 = timeZone.slice(index + 2);
        timeZone = timeZone1 + '/' + timeZone2;
        debug(timeZone);
        optionZmanim.timeZoneId = timeZone;
    }
}

function translateCityToEn(hebrewCity) {
    return new Promise((resolve, reject) => {
        const options = {
            "method": "POST",
            "hostname": "google-translate1.p.rapidapi.com",
            "port": null,
            "path": "/language/translate/v2",
            "headers": {
                "x-rapidapi-host": "google-translate1.p.rapidapi.com",
                "x-rapidapi-key": "c3c0959074mshf523092665bdcd2p1fbc9ajsn23e2d87bee42",
                "accept-encoding": "application/gzip",
                "content-type": "application/x-www-form-urlencoded",
                "useQueryString": true
            }
        };
        var req = https.request(options, function (response) {
            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });
        
            response.on("end", function () {
                const data = JSON.parse(body);
                const enCity = data.data.translations[0].translatedText;
                debug(enCity);
                resolve(enCity);
            });
        });
        
        req.write(qs.stringify({source: 'he', q: hebrewCity, target: 'en'}));
        req.end();
    });
}

module.exports = getZmanim;