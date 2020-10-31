const fs = require('fs');
const debug = require('debug')('app:manageJson');


function addToJson(val, name) {
    let infosJson = JSON.stringify(val);
    fs.writeFile(name, infosJson, function (err) {
        if (err) throw err;
        debug('Created json!')
    });
}

async function checkZmanim(date) {
    let zmanimJson = '';
    let zmanim = {};
    let rawData = fs.readFileSync('zmanim.json');
    try {
        zmanimJson = JSON.parse(rawData);
    } catch (err) {
        // debbug(err);
        return zmanim = {
            status: 2
        };
    }
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    date = yyyy + '-' + mm + '-' + dd;
    if ( date == zmanimJson.date) {
        zmanim = {
            status: 0,
            zmanimJson
        };
    } else {
        zmanim = {
            status: 1,
            zmanimJson
        };
    }
    return zmanim;
}

module.exports = {
    addToJson,
    checkZmanim
};