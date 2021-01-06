const express = require('express');
const debug = require('debug')('app:calendar');
const calendarRouter = express.Router();
const KosherZmanim = require('kosher-zmanim');
const zmanimFunction = require('../functions/zmanim');
const manageJson = require('../functions/manageJson');
const manageCookies = require('../functions/manageCookies');
const pagesFunctions = require('../functions/pagesFunctions');
const zmanimShabbat = require('../functions/getParasha');

  

function router() {

    calendarRouter.route('/')
        .get((req, res) => {
            (async () => {
                try {
                    const zmanim = await pagesFunctions.getAllZmanim(req, res);
                    const userDiv = pagesFunctions.userDiv(req);
                    debug(zmanim);
                    res.render('pages/calendar', {
                        pageTitle: 'לוח שנה',
                        userDiv,
                        zmanim,
                        search: ''
                    });
                } catch (err) {
                    debug('Error', err);
                }
            })();
        });


    calendarRouter.route('/zmanimLoc')
        .get((req, res) => {
            let city = req.query.city;
            let country = req.query.country;
            const nowDate = new Date();
            // const shabbatDate = getShabbatDate();
            (async () => {
                let zmanim = {};
                try {
                    zmanim = await zmanimFunction.getZmanim(nowDate, city, country, 'week');
                    // zmanim = await zmanimFunction.getZmanim(date, city, country, 'shabbat');
                    debug(zmanim);
                    if (zmanim == 9) {
                        res.json(zmanim);
                    } else {
                        // debug(zmanim);
                        // const allZmanimAndParasha = await zmanimShabbat(zmanim);
                        // debug(allZmanimAndParasha);
                        manageCookies.addCookies(zmanim, req, res);
                        res.redirect('back');

                    }
               } catch (e) {
                    debug(e);
                    res.json(50);
                }
            })();
        });


    return calendarRouter;
}

module.exports = router;