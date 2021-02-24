import * as model from "./model.js";
import * as view from "./view.js";

export function init() { }



var accessAnimFleg = false;
const mainWindow = $('.window_connexion');
const mainMessage = $('.message');
const mainLoader = $('#loader');

// date & time
(function () {
    let date = $('#date');
    let time = $('#time');
    view.dateAndTimeHeader(date, time);
})();

//accessibility
const accessibility = model.checkAccessibility();
if (accessibility == 'on') {
    accessAnimFleg = true;
    loopBarHours();
    sliderArea();
}

// get query message if exist
(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const status = model.checkQueryUrl(urlParams);
    if (status != 0) {
        view.alert(mainMessage, status)
    }
})();

// btn scroll to top show/hide
$(document).scroll(function () {
    const heightWindow = $(window).height();
    const scroll = $('html, body').scrollTop();
    const btn = $('.toTop');
    view.hideToTopBtn(heightWindow, scroll, btn);
});

// btn scroll to top click
$('.toTop').click(function () {
    const btn = $("html, body");
    view.clickToTop(btn);
});

// navBar soon
$('.soon').click(function () {
    view.alert(mainMessage, 45);
});

// get zmanim of location
$('#form-city').submit(async function (e) {
    e.preventDefault();
    view.process(mainLoader, true);
    const city = $('#form-city input').val();
    const status = await model.getZmanimLoc(city);
    if (status < 51) {
        view.process(mainLoader, false);
        view.alert(mainMessage, status);
    }
});

// open window login/regist
$('.btn-connexion').click(function (e) {
    // const connexionHtml = $('.window_connexion');
    view.connexion(e, mainWindow);
});

// header & footer btn account
$('.account').click(function (e) {
    const btnConnexion = $('.btn-connexion');
    if (btnConnexion.length === 1) {
        e.preventDefault();
        $('.btn-connexion').trigger('click');
    }
});

// footer btn register
$('.regist').click(function () {
    $('.btn-connexion').trigger('click');
    $('.con-header li').trigger('click');
});

// close window connexion/pop-up
$('.window_connexion, .message').on('click', '.btn_close, .cancel, .ok', function () {
    const divToEmpty = $(this).parents('.message_close');
    view.closeWindow(divToEmpty);
});

// switch login/regist
$('.window_connexion').on('click', '.con-header li', function () {
    const listConnexion = $('.con-header li');
    const bodyConnexion = $('.con-body');
    view.switchWindow(this, listConnexion, bodyConnexion);
});

// switch menu synagogue
$('.synagogue-header li').click(function () {
    const header = $('.synagogue-header li');
    const body = $('.synagogue-body');
    view.switchWindow(this, header, body);
});

// regist new user
$('.window_connexion').on('submit', '#form-regist', async function (e) {
    e.preventDefault();
    const formRegist = document.getElementById('form-regist');
    const status = await model.checkValuesRegist(formRegist);
    console.log(status);
    if (status[0] == 0) {
        createUser(formRegist);
    } else {
        const divError = $('.comment_error');
        const inputs = $('.input_form-regist');
        console.log(divError)
        view.checkValues(inputs, divError, status);
    }
});

// login
$('.window_connexion').on('submit', '#form-log', async function (e) {
    e.preventDefault();
    const formLogin = document.getElementById('form-log');
    const userStatus = await model.login(formLogin);
    if (userStatus == 1) {
        const divError = $('.comment_error-log');
        const inputs = $('.input_form-log');
        view.checkValuesLog(inputs, divError);
    }
});

// window add new synagogue
$('#add_synagogue').click(function () {
    // const addSynagogueHtml = $('.window_connexion');
    view.addSynagogue(mainWindow);
});

// check synagogue's values
$('.window_connexion').on('submit', '#add_syngogue_form', async function (e) {
    e.preventDefault();
    const form = document.getElementById('add_syngogue_form');
    const synagogueStatus = await model.checkVakueNewSynagogue(form);
    console.log(synagogueStatus);
    if (synagogueStatus[0] == 0) {
        addSynagogue(form);
        console.log('ok');
    } else {
        const divError = $('.comment_error');
        const inputs = $('.input_addSynagogue');
        console.log('not ok');
        view.checkValues(inputs, divError, synagogueStatus);
    }
});

// hover help text not click on input
$('.window_connexion').on('click', '.fa-question-circle', function (e) {
    e.preventDefault();
});

// load the image on select it
$('.window_connexion').on('change', '.input_img', function () {
    const input = this;
    const img = $(this).parent().find('img');
    view.loadImage(input, img);
});

// check new email to newletter
$('#addToNewLetter_form').submit(async function (e) {
    e.preventDefault();
    const form = document.getElementById('addToNewLetter_form');
    const synagogueId = $(this).data("id");
    const status = await model.checkValuesAddNewLetter(form, synagogueId);
    const commentsDiv = $('.comments');
    const input = $('#addToNewLetter_form input');
    if (status[0] == 0) {
        addToNewLetter(form, synagogueId, commentsDiv, input);
    } else {
        view.checkValues(input, commentsDiv, status);
    }
});

// window add tefila
$('.add_tefila').click(function () {
    const synagogueId = $(this).data('synagogueid');
    const tefilaType = $(this).data('tefilatype');
    // const addTefilaHtml = $('.window_connexion');
    view.windowAddTefila(synagogueId, tefilaType, mainWindow);
});

// switch on window add tefila: fixed hours to hours by day zmanim
$('.window_connexion').on('change', 'input[name=hours]', function () {
    const hoursValue = $(this).val();
    const select = $('#select_day_hours');
    const hour = $('#hour');
    const hourDay = $('#hour_day_time');
    view.enableAndDisable(hoursValue, select, hour, hourDay);
});

// switch on window add tefila: all days to a few days of week
$('.window_connexion').on('change', 'input[name=all_days]', function () {
    const daysValue = $(this).val();
    const daysInput = $('input[name=days]');
    view.checked(daysValue, daysInput);
});

// if checkbox of week day changed, checked input radio partial_days
$('.window_connexion').on('click', 'input[name=days]', function () {
    $('#partial_days').trigger('click');
});

// check tefila values
$('.window_connexion').on('submit', '#add_tefila_form', async function (e) {
    e.preventDefault();
    const form = document.getElementById('add_tefila_form');
    const synagogueId = $('input[type=submit]').data('synagogueid');
    const tefilaType = $('input[type=submit]').data('tefilatype');
    console.log(synagogueId);
    console.log(tefilaType);
    // const tefilaStatus = await model.checkVakueNewSynagogue(form);
    // console.log(tefilaStatus);
    // if (tefilaStatus[0] == 0) {
    addTefila(form, synagogueId, tefilaType);
    //     console.log('ok');
    // } else {
    //     const divError = $('.comment_error');
    //     const inputs = $('.input_addTefila');
    //     console.log('not ok');
    //     view.checkValues(inputs, divError, tefilaStatus);
    // }
});

// check search tefila city empty
$('#formSearchTefila').submit(function (e) {
    const city = $('#city_search').val();
    const status = model.confirmNotEmpty(city);
    if (status == 1) {
        e.preventDefault();
        view.alert(mainMessage, 47);
    }
});

// enabled/disabled select search tefila
$('#week_days').change(function () {
    const daysValue = $(this).val();
    const daysCheckbox = $('input[name=day]');
    const daysSelect = $('#tefila');
    // view.checked(daysValue, daysInput);
    view.changeSelectSearchTefila(daysValue, daysSelect, daysCheckbox);
});

// delete synagogue data
$('.remove_data').click(function () {
    const dataId = $(this).data('id');
    const dataType = $(this).data('type');
    const divHtml = $(this).parents('li');
    const dataTitle = divHtml.children('.data_name').html();
    // const main = $('.message');
    view.alertRemove(mainMessage, dataTitle);
    removeData(dataId, dataType, divHtml, mainMessage);
});

// delete synagogue
$('#del_synagogue').click(function () {
    const dataId = $(this).data('id');
    // const dataType = $(this).data('type');
    // const divHtml = $(this).parents('li');
    const dataTitle = $('#synagogue_name').html();
    // const main = $('.message');
    view.alertRemove(mainMessage, dataTitle);
    delSynagogue(dataId);
});

// send email forgot password
$('#form_forgotPass').submit(async function (e) {
    e.preventDefault();
    // view.process(mainLoader, true);
    const main = $('#main_forgotPass');
    const emailInput = $('#form_forgotPass input[type=email]');
    const commentDiv = $('#form_forgotPass .comments');
    const status = await model.sendEmailForgot($(emailInput).val());
    view.sendEmailForgot(main, emailInput, commentDiv, status);
    // view.process(mainLoader, false);
    // view.alert(mainMessage, status);
});

// event listener auto complete synagogues search
(async () => {
    const option = await model.autoComplete();
    $("#search_synagogue_input").autocomplete(option);
})();

// event listener auto complete google maps
google.maps.event.addDomListener(window, 'load', initialize);


// functions

async function createUser(formRegist) {
    const newUser = await model.createUser(formRegist);
    // const main = $('.message');
    if (newUser.tables[0]) {
        console.log('ok');
        // const window = $('.window_connexion');
        view.closeWindow(mainWindow);
        view.alert(mainMessage, 52);
    } else {
        console.log('not ok');
        view.alert(mainMessage, 50);
    }
}

async function addSynagogue(form) {
    view.process(mainLoader, true);
    const synagogueStatus = await model.addSynagogue(form);
    if (synagogueStatus.tables[0]) {
        view.process(mainLoader, false);
        view.closeWindow(mainWindow);
        view.alert(mainMessage, 53);
        const mainDiv = $('#synagogueList').find('ul');
        const mainListEmpty = $('#synagogueList').find('p');
        view.addToList('synagogue', synagogueStatus.tables[0], mainDiv, mainListEmpty);
    } else {
        view.process(mainLoader, false);
        view.alert(mainMessage, 50);
    }
}

async function addTefila(form, synagogueId, tefilaType) {
    // view.process(mainLoader, true);
    const tefilaStatus = await model.addTefila(form, synagogueId, tefilaType);
    if (tefilaStatus.tables[0]) {
        // view.process(mainLoader, false);
        view.closeWindow(mainWindow);
        view.alert(mainMessage, 54);
        // const mainDiv = $('#list_tefila_'+ tefilaType).find('ul');
        // const mainListEmpty = $('#list_tefila_'+ tefilaType).find('p');
        // console.log(mainDiv);
        // console.log(mainListEmpty);
        // view.addToList('tefila', tefilaStatus.tables[0], mainDiv, mainListEmpty);
        confirmToReload();
    } else {
        view.process(mainLoader, false);
        view.alert(mainMessage, 50);
    }
}

async function addToNewLetter(form, synagogueId, commentsDiv, input) {
    const newAddNewLetter = await model.addToNewLetter(form, synagogueId);
    if (newAddNewLetter.tables[0]) {
        console.log('ok');
        view.statusAddToNewLetter(commentsDiv, input, 51);
    } else {
        console.log('not ok');
        view.statusAddToNewLetter(commentsDiv, input, 50);
    }
}

function removeData(dataId, dataType, divHtml, main) {
    $('.ok').click(async function () {
        console.log('ok');
        console.log(dataId);
        const status = await model.removeData(dataId, dataType);
        if (status.status == 'Ok') {
            view.deleteDiv(divHtml);
            view.alert(main, 51);
        } else {
            view.alert(main, 50);
        }
        console.log(status);
    });
}

function delSynagogue(dataId) {
    $('.ok').click(async function () {
        console.log('ok');
        console.log(dataId);
        const status = await model.delSynagogue(dataId);
        if (status.status == 'ok') {
            window.location.replace('/account?m=removed');
        } else if (status.status == 'error') {
            view.alert(mainMessage, 50);
        }
        console.log(status);
    });
}

function confirmToReload() {
    $('.ok').click(async function () {
        location.href = location.href.split("?")[0];
    });
}


// slider-area
function sliderArea() {
    var pictures = $('.slider-area div').length;
    let sliderArea = $('.slider-area div');
    view.playAnimateSliderArea(sliderArea, pictures);
}

// hours bar
function loopBarHours() {
    var barHours = $('.bar_hours');
    view.playAnimateBarHours(barHours);
}

// pause hover animate
$('.bar_hours, .slider-area div').hover(function () {
    if (accessAnimFleg) {
        let animate = '';
        if ($(this).hasClass('bar_hours')) {
            animate = $('.bar_hours');
        } else {
            animate = $('.slider-area div');
        }
        const pictures = animate.length;
        view.stopInterval(animate, pictures);
    }
});

// accessibility stop animation
$('body').on('click', '#NLAnimations', function () {
    const clickAnim = $('#NLAnimationsVal').text();
    if (accessAnimFleg) {
        view.accessStopAnimation();
        accessAnimFleg = false;
    } else {
        sliderArea();
        loopBarHours();
        accessAnimFleg = true;
    }
});

// autocomplete gogle maps
function initialize() {
    var input = document.getElementById('form-dity_input');
    new google.maps.places.Autocomplete(input);
}