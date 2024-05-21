const fs = require('fs');
const debug = require('debug')('app:manageCookies');
const User = require('../schemas/UserSchema');

let expireDate = new Date(2534023000000);

function addUserCookies(user, req, res) {
    res.cookie('username', user.email, {
        expires: expireDate,
        httpOnly: true
    });
    res.cookie('token', user.token, {
        expires: expireDate,
        httpOnly: true
    });
}

function addCookies(val, req, res) {
    // let expireDate = '';
    // if (req.cookies.accept == true) {
    //     expireDate = new Date(25340230000000);
    // } else {
    //     expireDate = '';
    // }
    res.cookie('city', val.week.location.city, {
        expires: expireDate,
        httpOnly: true
    });
    res.cookie('country', val.week.location.country, {
        expires: expireDate,
        httpOnly: true
    });
    res.cookie('israel', val.week.israel, {
        expires: expireDate,
        httpOnly: true
    });
}

function checkUserCookies (req) {
    let cookies = {
        'status': 0,
        'cookiesValues': {}
    }
    if(req.cookies.username && req.cookies.token) {
        cookies.cookiesValues = {
            'username': req.cookies.username,
            'token': req.cookies.token
        }
    } else {
        cookies.status = 1;
    }
    return cookies;
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

async function signInToken(req, res) {
    try {
        const result = await User.collection.findOne({'email': req.cookies.username, 'token': req.cookies.token});
        if (result) {
            req.login(result, () => {
                addUserCookies(result, req, res);
            });
            return 0;
        } else {
            return 1;
        }
    } catch (e) {
        debug(e);
    }
}


module.exports = {
    addUserCookies,
    addCookies,
    checkUserCookies,
    checkCookies,
    signInToken
};