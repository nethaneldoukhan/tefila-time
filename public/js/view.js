import * as views from "./modules/views.js";

var stopBarHours = true;
var loopAnimateBarHours = '';
var loopAnimateSlideArea = '';
var countSlideArea = 0;
var position = 0;
var index1 = 0;
var index2 = 1;


//Date & Time navbar up
function dateAndTimeHeader(date, time) {
    setInterval (function () {
        let myDate = new Date; // Returns today's date object
        let formatsDate = {year: "numeric", month: "long", day: "numeric"};
        let formatsTime = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
        $(date).html(myDate.toLocaleDateString("he", formatsDate));
        $(time).html(myDate.toLocaleTimeString("he", formatsTime));
    }, 1000);


}

// play slider-area animate
function playAnimateSliderArea(sliderArea, pictures) {
    $(sliderArea[countSlideArea]).fadeIn();
    loopAnimateSlideArea = setInterval(animateSliderArea, 3000, sliderArea, pictures);
}

// slider-area animate
function animateSliderArea(sliderArea, pictures) {
    $(sliderArea[countSlideArea]).fadeOut(1000);
    countSlideArea ++;
    if(countSlideArea == pictures) {
        countSlideArea = 0;
    }
    $(sliderArea[countSlideArea]).fadeIn(1000);
}

// play hours bar animate
function playAnimateBarHours(barHours) {
    loopAnimateBarHours = setInterval(animateBarHours, 100, barHours);
}

// hour bar animate
function animateBarHours(barHours) {
    $(barHours[index1]).animate({
        right: position + 'px'
    }, 100);
    $(barHours[index2]).animate({
        right: position + 1200 + 'px'
    }, 100);
    position -= 5;
    if (position < -1199) {
        position = 0;
        $(barHours[index1]).css({right: position + 1200 + 'px'});
        if (index1 == 0) {
            index1 = 1;
            index2 = 0;
        } else {
            index1 = 0;
            index2 = 1;
        }
    }
}

// hover stop loop hours bar
function stopInterval(animate, pictures) {
    let loopAnimate = '';
    let animateFunction = '';
    let time = '';
    if ($(animate).hasClass('bar_hours')){
        loopAnimate = loopAnimateBarHours;
        animateFunction = playAnimateBarHours;
        time = 100;
    } else {
        loopAnimate = loopAnimateSlideArea;
        animateFunction = playAnimateSliderArea;
        time = 3000;
    }
    if (stopBarHours) {
        clearInterval(loopAnimate);
        stopBarHours = false;
    } else {
        animateFunction(animate, pictures);
        stopBarHours = true;
    }
}

// accessibility stop animation
function accessStopAnimation() {
    clearInterval(loopAnimateBarHours);
    clearInterval(loopAnimateSlideArea);
}

//btn scroll to top show/hide
function hideToTopBtn(heightWindow, scroll, btn) {
    if (heightWindow <= scroll) {
        $(btn).show();
    } else {
        $(btn).hide();
    }
}

// btn scroll to top click
function clickToTop(btn) {
    $(btn).animate({scrollTop: 0}, 400);
}

// message data process
// function process() {

// }

// open window login/regist
function connexion(e, connexionHtml){
    e.preventDefault();
    const html = views.htmlLoginRegist();
    connexionHtml.html(html);
}

// close window login/regist
function closeWindow(divToEmpty) {
    divToEmpty.empty();
}

// switch login/regist
function switchWindow(thisClick, list, body) {
    $(list).removeClass('actif');
    $(thisClick).addClass('actif');
    console.log(list);
    if ($(list[0]).hasClass('actif')) {
        $(body).addClass('disp-n');
        $(body[0]).removeClass('disp-n');
    } else if ($(list[1]).hasClass('actif')) {
        $(body).addClass('disp-n');
        $(body[1]).removeClass('disp-n');
    } else if ($(list[2]).hasClass('actif')) {
        $(body).addClass('disp-n');
        $(body[2]).removeClass('disp-n');
    }
}

// load the image on select it
function loadImage(input, img) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            img.attr('src', e.target.result);
            img.removeClass('disp-n');
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        img.attr('src', '');
        img.addClass('disp-n');
    }
}

function checkValues(vals, divError, allStatus) {
    resetValues(vals, divError);
    $(vals).each(function(i, val) {
        switch (allStatus[i + 1]) {
            case 1:
                $(val).addClass('error');
                $(divError[i]).html('השדה חובה');
                break;
            case 2:
                $(val).addClass('error');
                $(divError[i]).html('כתובת אימייל לא חוקית');
                break;
            case 3:
                $(val).addClass('error');
                $(divError[i]).html('כתובת האימייל כבר קיימת במערכת');
                break;
            case 4:
                $(val).addClass('error');
                $(divError[i]).html('הסיסמא צריכה להכיל 8 תווים מינימום');
                break;
            case 5:
                $(val).addClass('error');
                $(divError[i]).html('שתי הסיסמאות לא תואמות');
                break;
            case 6:
                $(val).addClass('error');
                $(divError[i]).html('חובה לאשר הסכמת התנאים');
                break;
            case 7:
                $(val).addClass('error');
                $(divError[i]).html('מספר הטלפון לא תקין');
                break;
            case 8:
                $(val).addClass('error');
                $(divError[i]).html('הבחירה שגויה');
                break;
            case 9:
                $(val).addClass('error');
                $(divError[i]).html('בית הכנסת כבר קיים במערכת');
                break;
            case 10:
                $(val).addClass('error');
                $(divError[i]).html('השדה לא מקבל אותיות בעברית');
                break;
            case 11:
                $(val).addClass('error');
                $(divError[i]).html('השדה מקבל רק אותיות בעברית');
                break;
            case 12:
                $(val).addClass('error');
                $(divError[i]).html('לא נבחר קובץ תמונה');
                break;
            case 13:
                $(val).addClass('error');
                $(divError[i]).html('הקובץ גדול יותר מ-2 MB');
                break;
            case 14:
                $(val).addClass('error');
                $(divError[i]).html('כתובת המייל לא קיימת במערכת.');
                break;
            case 50:
                alert($(divError[i]), 50);
                break;
        }
    });
}

function checkValuesLog(inputs, divError) {
    $(inputs).addClass('error');
    $(divError).html('אחד או יותר מהנתונים שגויים');
}

function resetValues(vals, divError) {
    $(vals).each(function(i, val){
        $(val).removeClass('error');
        $(divError[i]).removeClass('col-gn');
        $(divError[i]).empty();
    });
}

function statusAddToNewLetter(div, input, status) {
    resetValues(input, div);
    if (status == 51) {
        var message = "נרשמת בהצלחה.";
        var status = `<i class="fas fa-check mar0-10"></i>`;
        $(div).addClass('col-gn');
    } else {
        var message = "אירעה שגיעה. הבקשה לא נקלטה במערכת.";
    }
    $(div).html(status + message);
}

function updatePassword(updatePasswordDiv){
    const html = views.htmlUpdatePassword();
    updatePasswordDiv.html(html);
}

function addSynagogue(addSynagogueDiv){
    const html = views.htmlAddSynagogue();
    addSynagogueDiv.html(html);
}

function windowAddTefila(synagogueId, tefilaType, addTefilaDiv) {
    const html = views.htmlAddTefila(synagogueId, tefilaType);
    addTefilaDiv.html(html);
}

function enableAndDisable(val, selectZmanim, hour, hourDay) {
    if (val == 'fixed') {
        $(hour).prop('disabled', false);
        $(hourDay).prop('disabled', true);
        $(selectZmanim).prop('disabled', true);
    } else if (val == 'day_time') {
        $(hour).prop('disabled', true);
        $(hourDay).prop('disabled', false);
        $(selectZmanim).prop('disabled', false);
    }
}

function changeSelectSearchTefila(val, select, daysCheckbox) {
    if (val == 'all') {
        const option = views.buildSelectSearchTefila(val);
        $(select).prop('disabled', true);
        $(select).html(option);
        $(daysCheckbox).prop('disabled', false);
    } else if (val == 'week') {
        const option = views.buildSelectSearchTefila(val);
        $(select).prop('disabled', false);
        $(select).html(option);
        $(daysCheckbox).prop('disabled', false);
    } else if (val == 'shabbat') {
        const option = views.buildSelectSearchTefila(val);
        $(select).prop('disabled', false);
        $(select).html(option);
        $(daysCheckbox).prop('disabled', true);
    }
}

function checked(val, inputToChecked) {
    if (val == 'allDays') {
        $(inputToChecked).prop('checked', true);
    }
}

function alert(div, numCode) {
    let header = '';
    let message = '';
    const btnCancel = '';
    if(numCode > 50) {
        header = `<i class="fas fa-check col-gn mar0-20"></i> OK`;
        message = getOkMessage(numCode);
    } else {
        header = `<i class="fas fa-times col-r mar0-20"></i> נכשל`;
        message = getErrorMessage(numCode);
    }
    views.alert(div, header, message, btnCancel);
}

function alertRemove(div, title) {
    closeWindow(div);
    const header = `<i class="fas fa-exclamation-triangle mar0-20 col-yw"></i> אזהרה`;
    const message = `אתה עומד למחוק את הפרטים של <span class="bold"> "${title}"</span>. <br /> האם אתה בטוח ?`;
    const btnCancel = 'ביטול';
    views.alert(div, header, message, btnCancel);
}

function deleteDiv(div) {
    div.remove();
}

function getOkMessage(numCode) {
    let message = '';
    if (numCode == 51) {
        message = 'העידכון נקלט בהצלחה.';
    } else if (numCode == 52) {
        message = 'נרשמת בהצלחה. נא להתחבר שוב למערכת.'
    } else if (numCode == 53) {
        message = 'בית הכנסת התוסף בהצלחה.'
    } else if (numCode == 54) {
        message = 'התפילה נתוספה בהצלחה. \n העידכון יראה לאחר ריענון הדף.'
    } else if (numCode == 55) {
        message = 'בית הכנסת נמחק.'
    }
    return message;
}

function getErrorMessage(numCode) {
    let message = '';
    if (numCode == 1) {
        message = '';
    } else if (numCode == 2) {
        message = 'השדה ריק.'
    } else if (numCode == 9) {
        message = 'העיר לא נמצאת.'
    } else if (numCode == 11) {
        message = 'נא להכניס שם עיר ושם מדינה בצורה הזאת: \n "עיר, מדינה".'
    } else if (numCode == 44) {
        message = 'הקישור לא קיים או פג תוקף.';
    } else if (numCode == 45) {
        message = 'השירות בבניה.\n אנחנו עובדים שיופעל בקרוב בע"ה.';
    } else if (numCode == 46) {
        message = 'בית הכנסת לא קיים או נמחק.';
    } else if (numCode == 47) {
        message = 'לא הכנסת עיר בחיפוש. \n המידע חובה בשביל חישוב השעות.';
    } else if (numCode == 48) {
        message = 'אתה לא מורשה לבצע זאת.';
    } else if (numCode == 49) {
        message = 'אתה לא מחובר.';
    } else if (numCode == 50) {
        message = 'אירעה שגיעה. הבקשה לא נקלטה במערכת.';
    }
    return message;
}

function addToList(listName, object, mainDiv, mainListEmpty) {
    let li = '';
    if (listName == 'synagogue') {
        li = views.addListSynagogue(object);
    }
    console.log(mainDiv);
    console.log(li);
    $(mainDiv).append(li);
    deleteDiv(mainListEmpty);
}

function process(mainLoader, status) {
    if (status) {
        mainLoader.html(views.process());
    } else {
        closeWindow(mainLoader);
    }
}

function sendEmailForgot(main, emailInput, commentDiv, status) {
    if (!status || status == 50) {
        alert(main, 50);
    } else if (status == 14) {
        checkValues(emailInput, commentDiv, [14, 14]);
    } else {
        const html = views.sendEmailForgotDiv(status);
        $(main).html(html);
    }
}

export {
    dateAndTimeHeader,
    playAnimateSliderArea,
    playAnimateBarHours,
    stopInterval,
    accessStopAnimation,
    hideToTopBtn,
    clickToTop,
    connexion,
    closeWindow,
    switchWindow,
    checkValues,
    loadImage,
    checkValuesLog,
    statusAddToNewLetter,
    updatePassword,
    addSynagogue,
    windowAddTefila,
    enableAndDisable,
    changeSelectSearchTefila,
    checked,
    alert,
    alertRemove,
    deleteDiv,
    addToList,
    process,
    sendEmailForgot
};