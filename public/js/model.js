import * as ajax from "./modules/ajax.js";
import { DOMAINE } from "./config.js";

// check animation active
function checkAccessibility() {
    const accessJson = localStorage.getItem("Localize-NagishLi-A11y-Plugin-Settings");
    if (accessJson) {
        const accessAnim = JSON.parse(accessJson).animations;
        console.log(accessAnim);
        return accessAnim;
    } else {
        return 'on';
    }
}

function checkQueryUrl(urlParams) {
    let numCode = 0;
    if (urlParams.has('m')) {
        const queryString = urlParams.get('m');
        if (queryString == 'not_connected') {
            numCode = 49;
        } else if (queryString == 'removed') {
            numCode = 55;
        } else if (queryString == 'not_allowed') {
            numCode = 48;
        } else if (queryString == 'city_empty') {
            numCode = 47;
        } else if (queryString == 'not_exist') {
            numCode = 46;
        } else if (queryString == 'error') {
            numCode = 50;
        }
    }
    return numCode;
}

// get zmanim of location
async function getZmanimLoc(city){
    let status = '';
    if (city) {
        city = city.toLowerCase();
        let arrayCity = city.split(',');
        if (arrayCity.length == 2) {
            arrayCity = arrayCity.map(i=>i.trim());
            status = await ajax.getZmanimLoc(arrayCity);
            console.log(status);
        } else {
            status = 11;
        }

        if (status == 51) {
            const url = location.href.split("?");
            if (url[1] && url[1].includes('m=')) {
                location.href = url[0];
            } else {
                location.reload();
            } 
        }
    } else {
        status = 2;
    }
    return status;
}

// check new user's values
async function checkValuesRegist(theForm){
    console.log(theForm);
    const fName = confirmNotEmpty($(theForm[0]).val());
    const lName = confirmNotEmpty($(theForm[1]).val());
    const email = await confirmEmail($(theForm[2]).val(), true);
    const password1 = confirmPassword($(theForm[3]).val(), $(theForm[4]).val());
    const password2 = confirmPassword($(theForm[4]).val(), $(theForm[3]).val());
    const conditions = confirmConditions($(theForm[5]).prop('checked'));

    //status 1: field empty. 2: invalid email. 3: email already used. 4: code < 8 num. 5: code1 != code2. 6: conditions not checked
    const allStatus = [fName + lName + email + password1 + password2 + conditions, fName, lName, email, password1, password2, conditions];

    return allStatus;
}

async function login(theForm) {
    let formData = new FormData();
    formData.append('email', $(theForm[0]).val());
    formData.append('password', $(theForm[1]).val());
    formData.append('keep_con', $(theForm[2]).prop('checked'));
    // const email = $(theForm[0]).val();
    // const password = $(theForm[1]).val();
    // const checkUser = await ajax.login(email, password);
    const checkUser = await ajax.login(formData);
    console.log(checkUser);
    if (checkUser == 1) {
        return checkUser;
    } else {
        location.href = `${DOMAINE}/account`;
    }
}

async function createUser(theForm){
    const token = 'Token' + (Math.floor(Math.random() * 99999999) + 10000000);
    const formData = new FormData(theForm);
    formData.append('roleUser', 3);
    formData.append('token', token);
    formData.append('createDate', new Date());
    let arr = [];
    for (let input of formData.entries()) {
        arr.push(input[1]);
    }
    const settings = await ajax.createUser(arr);
    return settings;
}

async function checkVakueNewSynagogue(form) {
    let nameHe = confirmNotEmpty($(form[0]).val());
    if (nameHe == 0) {
        nameHe = checkRxHebrew($(form[0]).val(), 'he');
        if (nameHe == 0) {
            nameHe = await checkExistSynagogue($(form[0]).val(), $(form[4]).val());
        }
    }
    let nameEnInput = $(form[1]).val();
    let nameEn = 0;
    if (nameEnInput) {
        nameEn = checkRxHebrew(nameEnInput, 'en');
    } else {
        nameEn == 0;
    }
    const rite = confirmSelect($(form[2]).val(), 1, 3);
    const synagogueRoleUser = confirmSelect($(form[3]).val(), 1, 4);
    const street = confirmNotEmpty($(form[4]).val());
    const streetNumber = confirmNotEmpty($(form[5]).val());
    const city = confirmNotEmpty($(form[6]).val());
    const country = confirmNotEmpty($(form[7]).val());
    const email = await confirmEmail($(form[8]).val(), false);
    const phone = confirmPhone($(form[9]).val());
    const photo = checkImage($(form[10]).prop('files'));
    const panoramic = checkImage($(form[11]).prop('files'));
    const conditions = confirmConditions($(form[12]).prop('checked'));

    // status 1: field empty. 2: invalid email. 6: conditions not checked. 7: invalid phone. 8: error select. 9: synagogue already exist. 12: not image file. 13: big to 2 MB.
    const allStatus = [nameHe + nameEn + rite + synagogueRoleUser + street + streetNumber + city + country + email + phone + photo + panoramic + conditions, nameHe, nameEn, rite, synagogueRoleUser, street, streetNumber, city, country, email, phone, photo, panoramic, conditions];
    console.log(allStatus);

    return allStatus;
}

async function checkExistSynagogue(name, street) {
    let status = 0;
    if (name && street) {
        let formData = new FormData();
        formData.append('name', name);
        formData.append('street', street);
        const settings = await ajax.checkExistSynagogue(formData);
        console.log(settings);
        status = settings.status; // if not already exist, status = 0. else status = 9. if error, status 50.
    }
    return status;
}

async function addSynagogue(theForm) {
    let formData = new FormData(theForm);
    formData.append('createDate', new Date());
    const settings = await ajax.addSynagogue(formData);
    console.log(settings);
    return settings;
}

async function addTefila(theForm, synagogueId, tefilaType) {
    let formData = new FormData(theForm);
    formData.append('synagogueId', synagogueId);
    formData.append('tefilaType', tefilaType);
    if ($(theForm.hour).val()) {
        formData.append('hour_day_time', '');
        formData.append('day_hours', '');
    } else if ($(theForm.hour_day_time).val() && $(theForm.day_hours).val()) {
        formData.append('hour', '');
    }
    formData.append('createDate', new Date());
    const settings = await ajax.addTefila(formData);
    console.log(settings);
    return settings;
}

async function removeData(dataId, dataType) {
    let formData = new FormData();
    formData.append('dataId', dataId);
    formData.append('dataType', dataType);
    formData.append('date', new Date());
    const status = await ajax.removeData(formData);
    return status;
}

async function delSynagogue(dataId) {
    let formData = new FormData();
    formData.append('dataId', dataId);
    const status = await ajax.delSynagogue(formData);
    return status;
}

async function checkValuesAddNewLetter(theForm, synagogueId){
    const email = ($(theForm[0]).val());
    const statusEmail = await confirmEmailNewLetter(synagogueId, email);

    //status 1: field empty. 2: invalid email. 3: email already reg.
    const allStatus = [statusEmail, statusEmail];

    return allStatus;
}

async function addToNewLetter(form, synagogueId) {
    let formData = new FormData(form);
    formData.append('synagogueId', synagogueId);
    formData.append('createDate', new Date());
    const settings = await ajax.addToNewLetter(formData);
    return settings;
}

function confirmNotEmpty(x) {
    let status = 0;
    if(x == '') {
        status = 1;
    }
    return status;
}

function checkRxHebrew(x, lang) {
    const hebrewRx = /[\u0590-\u05FF]/;
    const nonHebrewRx = /[A-z]/g;
    let status = 0;
    if (x.match(hebrewRx) && x.match(nonHebrewRx)) {
        status = 0;
    } else {
        if (x.match(nonHebrewRx)) {
            status = 1;
        } else if (x.match(hebrewRx)) {
            status = 2;
        }
    }
    if (lang == 'en') {
        if (status == 1) {
            return 0;
        } else {
            return 10;
        }
    }
    if (lang == 'he') {
        if (status == 2) {
            return 0;
        } else {
            return 11;
        }
    }
    
}

async function confirmEmail(x, check) {
    let status = 0;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(x == '') {
        status = 1;
    } else {
        if (x.match(mailFormat) && check) {
            status = await checkExistEmail(x); // if already used, status = 3. else status = 0.
        }
        if (!x.match(mailFormat)) {
            status = 2;
        }
    }
    return status;
}

function confirmPhone(x) {
    let status = 0;
    const phoneFormat = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
    if(x == '') {
        status = 1;
    } else {
        if (!x.match(phoneFormat)) {
            status = 2;
        }
    }
    return status;
}

// check exist email
async function checkExistEmail(x) {
    let status = 0;
    const existEmail = await ajax.checkExistEmail(x);
    if (existEmail.status != 'ok') {
        status = 3;
    }
    return status;
}

async function confirmEmailNewLetter(synagogueId, email) {
    let status = 0;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email == '') {
        status = 1;
    } else {
        if (email.match(mailFormat)) {
            status = await existNewLetter(synagogueId, email); // if already used, status = 3. else status = 0.
        } else {
            status = 2;
        }
    }
    return status;
}

// check exist newletter
async function existNewLetter(synagogueId, email) {
    let status = 0;
    const existNewLetter = await ajax.existNewLetter(synagogueId, email);
    if (existNewLetter.status != 'ok') {
        status = 3;
    }
    return status;
}

// check values
function confirmPassword(x, y) {
    let status = 0;
    if(x.length < 8) {
        status = 4;
    } else if(x != y) {
        status = 5
    }
    return status;
}

// check values select
function confirmSelect(val, x, y) {
    if (!val || val == 0) {
        return 1;
    }
    if (val < x || val > y) {
        return 8;
    }
    return 0;
}

// check checkbox conditions
function confirmConditions(x) {
    // if($(x).is(':checked') === false) {
    if(x) {
        return 0;
    }
    return 6;
}

function checkImage(inputFile) {
    if (inputFile && inputFile[0]) {
        const file = inputFile[0];
        console.log(file);
        var pattern = /image-*/;
        if (!file.type.match(pattern)) {
            return 12;
        }
        if (file.size > 2000000) {
            return 13;
        }
        return 0;
    } else {
        return 0;
    }
}

async function sendEmailForgot(email) {
    let formData = new FormData();
    formData.append('email', email);
    const settings = await ajax.sendEmailForgot(formData);
    return settings;
}

async function autoComplete() {
    const response = await ajax.getDataAutoComplete();
    const autoCompleteOption = {
        source: response,
        autoFocus: true,
        minLength: 1,
        select: function(event, ui) {
            $(event.target).val(ui.item.value);
            $('#search_synagogue').submit();
            return false;
        }
    }
    return autoCompleteOption;
}


export {
    checkAccessibility,
    confirmNotEmpty,
    checkQueryUrl,
    getZmanimLoc,
    checkValuesRegist,
    login,
    createUser,
    checkVakueNewSynagogue,
    addSynagogue,
    addTefila,
    removeData,
    delSynagogue,
    checkValuesAddNewLetter,
    addToNewLetter,
    sendEmailForgot,
    autoComplete
};