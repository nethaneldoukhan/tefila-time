const fs = require('fs');
const debug = require('debug')('app:manageCookies');


function addCookies(val, req, res) {
    let expireDate = new Date(2534023000000);
    // let expireDate = '';
    // if (req.cookies.accept == true) {
    //     expireDate = new Date(25340230000000);
    // } else {
    //     expireDate = '';
    // }
    res.cookie('city' , val.week.location.city, {
        expires: expireDate,
        httpOnly: true
    });
    res.cookie('country' , val.week.location.country, {
        expires: expireDate,
        httpOnly: true
    });
    res.cookie('israel' , val.week.israel, {
        expires: expireDate,
        httpOnly: true
    });
}

function checkCookies (req) {
    let cookies = {
        'status': 0,
        'cookiesValues': {}
    }
    if(req.cookies.city && req.cookies.country && req.cookies.israel) {
        cookies.cookiesValues = {
            'city': req.cookies.city,
            'country': req.cookies.country,
            'israel': req.cookies.israel
        };
    } else {
        cookies.status = 1;
    }
    return cookies;
}


module.exports = {
    addCookies,
    checkCookies
};