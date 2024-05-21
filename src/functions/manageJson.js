const fs = require('fs');
const debug = require('debug')('app:manageJson');


function writeToJson(val, name) {
    let infosJson = JSON.stringify(val);
    fs.writeFile(name, infosJson, function (err) {
        if (err) throw err;
    });
}

async function readJson(file) {
    let data = '';
    let rawData = fs.readFileSync(file);
    try {
        data = JSON.parse(rawData);
        return data;
    } catch (err) {
        debbug(err);
        return false;
    }
}


module.exports = {
    writeToJson,
    readJson
};