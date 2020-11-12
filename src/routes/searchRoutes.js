const https = require('https');
const qs = require("querystring");
const fs = require('fs');
const express = require('express');
const searchRouter = express.Router();
const debug = require('debug')('app:search');
const {MongoClient, ObjectID} = require('mongodb');
const zmanimFunction = require('../functions/zmanim');
const pagesFunctions = require('../functions/pagesFunctions');
const Synagogue = require('../schemas/SynagogueSchema');
const WeekTefila = require('../schemas/WeekTefilaSchema');
const ShabbatTefila = require('../schemas/ShabbatTefilaSchema');
const City = require('../schemas/CitySchema');



function router() {

    searchRouter.route('/')
        .get((req, res) => {
            res.redirect('/search/synagogue');
        });

    searchRouter.route('/synagoguesAutoComplete')
        .get((req, res) => {
            (async () => {
                try {
                    const synagoguesListHe = await Synagogue.collection.distinct("name");
                    const synagoguesListEn = await Synagogue.collection.distinct("nameEn");
                    const synagoguesList = synagoguesListHe.concat(synagoguesListEn);
                    res.json(synagoguesList);
                } catch (err) {
                    debug('autoComplete', err);
                    res.json('error');
                }
            })();
        });

    searchRouter.route('/synagogue')
        .get((req, res) => {
            let synagogues = '';
            let search = {
                barSearch: '',
                name: '',
                nameEn: '',
                street:'',
                city: '',
                country: '',
                rite: []
            };
            
            (async () => {
                try {
                    if (req.query.q) {  // from bar search
                        let q = req.query.q;
                        qSplit = req.query.q.split(' ');
                        let qArray = [];
                        qSplit.forEach(item => {
                            if (item) {
                                qArray.push(item);
                            }
                        });
                        if (qArray[0]) {
                            // const regex = q.map(function (k) { return new RegExp(`^${k}$`, 'i') });
                            const regex = qArray.join("|");
                            const queryObject = {"$or": [{
                                    "name": {"$regex": regex, "$options": "i"}
                                }, {
                                    "nameEn": {"$regex": regex, "$options": "i"}
                                }, {
                                    "street": {"$regex": regex, "$options": "i"}
                                }]
                            };
                            synagogues = await getSynagoguesSearch(queryObject);
                            search.barSearch = q;
                        }
                    } else if (req.query.name || req.query.nameEn || req.query.street 
                        || req.query.city || req.query.country || req.query.rite) { // from advanced search
                        synagogues = await synagoguesSearch(req, search);
                    } else if (req.query.synagogues) { // from nav bar synagogue
                        const queryObject = "";
                        synagogues = await getSynagoguesSearch(queryObject);
                    }
                    const zmanim = await pagesFunctions.getAllZmanim(req, res);
                    const userDiv = pagesFunctions.userDiv(req);
                    res.render('pages/searchSynagogue', {
                        pageTitle: 'חיפוש בית כנסת',
                        userDiv,
                        zmanim,
                        synagogues,
                        search
                    });
                } catch (err) {
                    debug('Error', err)
                }
            })();
        });

    searchRouter.route('/tefila')
        .get((req, res) => {
            let synagogues = '';
            let finalTefilotArray = [];
            let tefilot = '';
            let search = {
                tefila: '',
                name: '',
                nameEn: '',
                street:'',
                city: '',
                country: '',
                rite: [],
                day: 0
            };
            
            (async () => {
                try {
                    if (!req.query.city && !req.query.m) {
                        res.redirect('/search/tefila?m=city_empty');
                    } else if (req.query.name || req.query.nameEn || req.query.street 
                        || req.query.city || req.query.country || req.query.rite) { // from advanced search
                        synagogues = await synagoguesSearch(req, search);
                        debug(synagogues);
                       if (synagogues[0]) {
                            tefilot = await tefilotSearch(req, search, synagogues);
                            debug(tefilot);
                            debug(search);
                            if (tefilot[0][0] || tefilot[1][0]) {
                                let locZmanim = await getLocZmanim(synagogues);
                                if (locZmanim) {
                                    refactCollecTefilot(tefilot, locZmanim, synagogues);
                                    finalTefilotArray = tefilot[0].concat(tefilot[1]);
                                    pagesFunctions.sortItem(finalTefilotArray, 'hour');
                                    // debug(finalTefilotArray);
                                } else {
                                    debug(locZmanim);
                                    res.redirect('/search/tefila?m=error');
                                }
                            }
                        }
                    }
                    const zmanim = await pagesFunctions.getAllZmanim(req, res);
                    const userDiv = pagesFunctions.userDiv(req);
                    debug(search);
                    res.render('pages/searchTefila', {
                        pageTitle: 'חיפוש תפילה',
                        userDiv,
                        zmanim,
                        finalTefilotArray,
                        search
                    });
                } catch (err) {
                    debug('Error', err);
                    res.redirect('/search/tefila?m=error');
                }
            })();
        });


    return searchRouter;
}

async function synagoguesSearch(req, search) {
    let querySynagoguesArray = [];
    if (req.query.name) {
        let name = {'name': {"$regex": req.query.name, "$options": "i"}};
        querySynagoguesArray.push(name);
        search.name = req.query.name;
    }
    if (req.query.nameEn) {
        let nameEn = {'nameEn': {"$regex": req.query.nameEn, "$options": "i"}};
        querySynagoguesArray.push(nameEn);
        search.nameEn = req.query.nameEn;
    }
    if (req.query.street) {
        let street = {"street": {"$regex": req.query.street, "$options": "i"}};
        querySynagoguesArray.push(street);
        search.street = req.query.street;
    }
    if (req.query.city) {
        let city = {'city': {"$regex": "^" + req.query.city + "$", "$options": "i"}};
        querySynagoguesArray.push(city);
        search.city = req.query.city;
    }
    if (req.query.country) {
        let country = {'country': {"$regex": req.query.country, "$options": "i"}};
        querySynagoguesArray.push(country);
        search.country = req.query.country;
    }
    if (req.query.rite) {
        let rite = {};
        if (req.query.rite[1]) {
            rite = {'rite': {"$in": req.query.rite}};
        } else {
            rite = {'rite': req.query.rite};
        }
        querySynagoguesArray.push(rite);
        search.rite = req.query.rite;
    }
    debug(querySynagoguesArray);
    const querySynagoguesObject = { "$and": querySynagoguesArray };
    let synagogues = await getSynagoguesSearch(querySynagoguesObject);
    return synagogues;
}

async function getSynagoguesSearch(queryObject) {
    let array = await Synagogue.collection.find(queryObject).sort({'name': 1}).toArray();
    array.forEach(item => {
        if (item.rite == 1) {
            item.rite = 'ע"מ';
        } else if (item.rite == 2) {
            item.rite = 'אשכנז';
        } else if (item.rite == 3) {
            item.rite = 'ספרד';
        }
    });
    return array;
}

function nameTefilaType(tefilaType) {
    if (tefilaType == 1) {
        return 'שחרית חול';
    } else if (tefilaType == 2) {
        return 'מנחה חול';
    } else if (tefilaType == 3) {
        return 'ערבית חול';
    } else if (tefilaType == 4) {
        return 'מנחה ער"ש';
    } else if (tefilaType == 5) {
        return 'שחרית שבת';
    } else if (tefilaType == 6) {
        return 'מנחה שבת';
    } else if (tefilaType == 7) {
        return 'ערבית מוצ"ש';
    }
}

async function tefilotSearch(req, search, synagogues) {
    queryTefilaArray = [];
    const synagogesId = synagogues.map(synagogue => {
        return synagogue._id.toString();
    });
    debug(synagogesId);
    // let country = {'synagogueId': {"$in": synagogesId}};
    queryTefilaArray.push({'synagogueId': {"$in": synagogesId}});
    if (req.query.tefila) {
        let tefila = '';
        if (req.query.tefila == 'all' || !req.query.tefila) {
            tefila = {'tefilaType': {"$in": ["1", "2", "3", "4", "5", "6", "7"]}};
        } else if (req.query.tefila == 'week') {
            tefila = {'tefilaType': {"$in": ["1", "2", "3"]}};
        } else if (req.query.tefila == 'shabbat') {
            tefila = {'tefilaType': {"$in": ["4", "5", "6", "7"]}};
        } else {
            tefila = {'tefilaType': req.query.tefila};
        }
        queryTefilaArray.push(tefila);
        search.tefila = req.query.tefila;
    }
    if (req.query.day) {
        let day = {};
        if (req.query.day[1]) {
            day = {'days': {"$in": req.query.day}};
        } else {
            day = {'days': req.query.day};
        }
        queryTefilaArray.push(day);
        search.day = req.query.day;
    }
    debug(queryTefilaArray);
    debug(queryTefilaArray[1]);
    const queryObject = { "$and": queryTefilaArray };
    let tefilot = await getTefilotSearch(queryObject);
    return tefilot;
}

async function getLocZmanim(synagogues) {
    let locZmanim = {};
    try {
        locZmanim = await zmanimFunction.getZmanim(new Date(), synagogues[0].city.toLowerCase(), synagogues[0].country.toLowerCase(), 'week');
        const shabbatDate = pagesFunctions.getShabbatDate();
        locZmanim = await zmanimFunction.getZmanim(shabbatDate, synagogues[0].city.toLowerCase(), synagogues[0].country.toLowerCase(), 'shabbat');
        // locZmanim.shabbat.kosherZmanim = locZmanimShabbat.kosherZmanim.shabbat;
    } catch (err) {
        debug('getZmanim', err);
    }
    return locZmanim;
}

function refactCollecTefilot(tefilot, locZmanim, synagogues) {
    tefilot.forEach(item => {
        item.forEach(item => {
            if(item.hour_day_time) {
                let weekDay = '';
                if (item.tefilaType < 4) {
                    weekDay = 'week';
                } else {
                    weekDay = 'shabbat';
                }
                const calcs = pagesFunctions.getBtnCalc(item.day_hours, locZmanim, weekDay);
                item.hour = pagesFunctions.calcDayTime(calcs.day_hour, item.hour_day_time, calcs.btn);
                item.day_hours = calcs.day_hours.slice(6);
            }
            const synagogueFound = synagogues.find(synagogue => {
                return synagogue._id == item.synagogueId;
            });
            // debug(synagogueFound);
            item.tefilaType = nameTefilaType(item.tefilaType);
            item.nameSyna = synagogueFound.name;
            item.rite = synagogueFound.rite;
            item.street = synagogueFound.street;
            item.streetNumber = synagogueFound.streetNumber;
            item.city = synagogueFound.city;
            item.photo = synagogueFound.photo;
        });
    });
}


async function getTefilotSearch(queryObject) {
    let arrayWeek = await WeekTefila.collection.find(queryObject).toArray();
    let arrayShabbat = await ShabbatTefila.collection.find(queryObject).toArray();
    return [arrayWeek, arrayShabbat]
}


module.exports = router;