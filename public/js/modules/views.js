// window login/regist
function htmlLoginRegist() {
    let loginReg = 
    `<div class="message_box">
        <div class="con-box wid300 allBor">
            <div class="btn_close col-w right--20 top-0">
                <i class="fas fa-times"></i>
            </div>
            <nav class="con-header">
                
                <ul>
                    <li class="col-w wid150 pad10-0 point bc-gy-l_h actif">
                    התחברות
                    </li>

                    <li class="col-w wid150 pad10-0 point bc-gy-l_h">
                        הרשמה
                    </li>
                </ul>
            </nav>
            <hr>

            <!-- login -->
            <div class="con-body pad10">

                <p class="col-gy-b">
                    אם אין לך עדיין חשבון, אפשר ללחוץ על "הרשמה" ולהירשם בקלות ובמהירות !
                </p>

                <form action="/auth/sign-in" method="post" id="form-log">

                    <div class="mar20-0">

                        <span class="comment_error-log fs-13 col-r"></span> <br />

                        <i class="far fa-envelope"></i>
                        <input type="email" name="email" id="con-mail" placeholder="מייל" class="input_design input_form-log wid100pc bs" />

                    </div>

                    <div class="mar20-0">

                        <i class="fas fa-lock"></i>
                        <input type="password" name="password" id="con-pass" placeholder="סיסמא" class="input_design input_form-log wid100pc bs" />

                    </div>

                    <div>
                        <div class="floatR ta-r">
                            <input type="checkbox" name="keep_con" id="keep_con" class="input_design" />
                            <label for="keep_con" class="fs-13">השאר מחובר</label>
                        </div>

                        <div class="floatL ta-l fs-13">
                            <a href="/forgot_password" class="fs-13 lin_h">
                                שכחתי את הסיסמא
                            </a>
                        </div>
                        
                        <div class="clear"></div>
                    </div>

                    <input type="submit" value="התחברות" class="btn mar20-0 col-w c-yw_h pad9-40 bor_rad5" />

                </form>
            </div>


            <!-- register -->
            <div class="con-body pad10 disp-n">

                <p class="col-gy-b">
                    הרשמה בקלות ובמהירות !
                </p>

                <form action="" method="post" id="form-regist" class="ta-r">

                    <div class="mar20-0">

                        <input type="text" name="fName" id="fName" placeholder="שם פרטי" class="input_design input_form-regist wid96pc bs" />
                        <span class="col-r">*</span>
                        <span class="comment_error fs-13 col-r"></span> <br />

                    </div>

                    <div class="mar20-0">

                        <input type="text" name="lName" id="lName" placeholder="שם משפחה" class="input_design input_form-regist wid96pc bs" />
                        <span class="col-r">*</span>
                        <span class="comment_error fs-13 col-r"></span> <br />

                    </div>

                    <div class="mar20-0">

                        <i class="far fa-envelope"></i>
                        <input type="email" name="email" id="regist-mail" placeholder="מייל" class="input_design input_form-regist wid96pc bs" />
                        <span class="col-r">*</span>
                        <span class="comment_error fs-13 col-r"></span> <br />

                    </div>

                    <div class="mar20-0">

                        <i class="fas fa-lock"></i>
                        <input type="password" name="password" id="regist-pass" placeholder="סיסמא" class="input_design input_form-regist wid96pc bs" />
                        <span class="col-r">*</span>
                        <span class="comment_error fs-13 col-r"></span> <br />
                        
                    </div>

                    <div class="mar20-0">

                        <i class="fas fa-lock"></i>
                        <input type="password" name="regist-pass-comfirm" id="regist-pass-comfirm" placeholder="אישור סיסמא" class="input_design input_form-regist wid96pc bs" />
                        <span class="col-r">*</span>
                        <span class="comment_error fs-13 col-r"></span> <br />
                        
                    </div>

                    <div>

                        <input type="checkbox" name="conditions" id="conditions" class="input_design input_form-regist" />
                        <span class="col-r">*</span>
                        <label for="conditions" class="fs-13">אני מאשר/ת שקראתי את <a href="#" class="fs-13">התקנון</a></label> <br />
                        <span class="comment_error fs-13 col-r"></span> <br />
                        
                    </div>

                    <p class="mar0 col-r">* שדה חובה</p>

                    <div class="ta-c">
                        <input type="submit" value="הרשמה" class="btn mar20-0 col-w c-yw_h ta-c pad9-40 bor_rad5" />
                    </div>

                </form>
            </div>
        </div>
    </div>`;
    return loginReg;
}

// function alert(mainDiv, status, message) {
//     $(mainDiv).html(
//         `<div class="rel marT20 pad5">
//             <div class="btn_close">
//                 <i class="fas fa-times"></i>
//             </div>

//             <p>
//                 ${status}${message}
//             </p>
//         </div>`
//     );
// }

function alert(mainDiv, header, message, btnCancel) {
    if (btnCancel) {
        btnCancel = `<a href="javascript:void(0)" class="cancel mar10 bc-gy-b bc-gy-l_h col-w ta-c pad9-40 bor_rad5">${btnCancel}</a>`;
    }
    $(mainDiv).html(
        `<div class="message_box">
            <div class="con-box wid700 allBor">
                <div class="btn_close col-w right--20 top-0">
                    <i class="fas fa-times"></i>
                </div>

                <div class="con-header">
                    <h4 class="col-w bold pad10-0 bc-gy-b bor_rad5-top">
                        ${header}
                    </h4>
                </div>

                <div class="con-body pad10">
                    <p>
                        ${message}
                    </p>
            
                    <div class="mar30">

                        ${btnCancel}

                        <a href="javascript:void(0)" class="ok btn mar10 col-w c-yw_h ta-c pad9-40 bor_rad5">
                            אישור
                        </a>

                    </div>
                </div>
            </div>
        </div>`
    );
}

function htmlAddSynagogue() {
    let addSynagogue = 
        `<div class="message_box">
        <div class="con-box wid700 allBor">
            <div class="btn_close col-w right--20 top-0">
                <i class="fas fa-times"></i>
            </div>

            <div class="con-header">
                <h4 class="col-w pad10-0 bc_blu-lin bor_rad5-top">
                    הוסף בית כנסת
                </h4>
            </div>

            <!-- register -->
            <div class="con-body pad10">

                <p class="col-gy-b">
                    הוסף בית כנסת חדש לחשבון
                </p>

                <form action="/synagogue/addSynagogue" encType="multipart/form-data" ref="uploadForm" method="post" id="add_syngogue_form" class="ta-r">

                    <div>

                        <div>
                            <div class="mar20-0 wid44pc floatR">

                                <i class="fas fa-synagogue"></i>
                                <input type="text" name="name" id="name" placeholder="שם בית הכנסת בעברית" class="input_design input_addSynagogue wid96pc bs" />
                                <span class="col-r">*</span>
                                <span class="comment_error fs-13 col-r"></span> <br />

                            </div>

                            <div class="mar20-0 wid44pc floatL">

                                <i class="fas fa-synagogue"></i>
                                <input type="text" name="name_en" id="name_en" placeholder="שם ביהכ&quot;נ באנגלית (לא חובה)" class="input_design input_addSynagogue wid96pc bs" />
                                <span class="comment_error fs-13 col-r"></span> <br />

                            </div>

                            <div class="clear"></div>

                        </div>

                        <div>
                            <div class="mar20-0 wid44pc floatR">

                                <select name="rite" id="rite" class="input_addSynagogue wid96pc bs" >
                                    <option value="0">בחר נוסח</option>
                                    <option value="1">ע"מ</option>
                                    <option value="2">אשכנז</option>
                                    <option value="3">ספרד</option>
                                </select>
                                <span class="col-r">*</span>
                                <span class="comment_error fs-13 col-r"></span> <br />

                            </div>

                            <div class="mar20-0 wid44pc floatL">

                                <select name="synagogueRoleUser" id="synagogueRoleUser" class="input_addSynagogue wid96pc bs">
                                    <option value="0">בחר תפקיד</option>
                                    <option value="1">רב בית הכנסת</option>
                                    <option value="2">גבאי</option>
                                    <option value="3">מתפלל</option>
                                    <option value="4">אחר</option>
                                </select>
                                <span class="col-r">*</span>
                                <span class="comment_error fs-13 col-r"></span> <br />

                            </div>

                            <div class="clear"></div>

                        </div>

                        <div>
                            <div class="mar20-0 wid44pc floatR">

                                <i class="fas fa-map-marker-alt"></i>
                                <input type="text" name="street" id="street" placeholder="רחוב" class="input_design input_addSynagogue wid96pc bs" />
                                <span class="col-r">*</span>
                                <span class="comment_error fs-13 col-r"></span> <br />
                                
                            </div>

                            <div class="mar20-0 wid44pc floatL">

                                <i class="fas fa-map-marker-alt"></i>
                                <input type="text" name="streetNumber" id="streetNumber" placeholder="מס' בית" class="input_design input_addSynagogue wid96pc bs" />
                                <span class="col-r">*</span>
                                <span class="comment_error fs-13 col-r"></span> <br />
                                
                            </div>

                            <div class="clear"></div>

                        </div>

                        <div>
                            <div class="mar20-0 wid44pc floatR">

                                <i class="fas fa-map-marker-alt"></i>
                                <input type="text" name="city" id="city" placeholder="עיר" class="input_design input_addSynagogue wid96pc bs" />
                                <span class="col-r">*</span>
                                <span class="comment_error fs-13 col-r"></span> <br />
                                
                            </div>

                            <div class="mar20-0 wid44pc floatL">

                                <i class="fas fa-globe"></i>
                                <input type="text" name="country" id="country" placeholder="מדינה" class="input_design input_addSynagogue wid96pc bs" />
                                <span class="col-r">*</span>
                                <span class="comment_error fs-13 col-r"></span> <br />
                                
                            </div>

                            <div class="clear"></div>

                        </div>

                        <div>
                            <div class="mar20-0 wid44pc floatR">

                                <i class="far fa-envelope"></i>
                                <input type="email" name="email" id="email" placeholder="מייל" class="input_design input_addSynagogue wid96pc bs" />
                                <span class="col-r">*</span>
                                <span class="comment_error fs-13 col-r"></span> <br />

                            </div>

                            <div class="mar20-0 wid44pc floatL">

                                <i class="fas fa-phone-square"></i>
                                <input type="tel" name="phone" id="phone" placeholder="טלפון" class="input_design input_addSynagogue wid96pc bs" />
                                <span class="comment_error fs-13 col-r"></span> <br />
                                
                            </div>

                            <div class="clear"></div>

                        </div>

                        <div>
                            <div class="mar20-0 wid44pc ta-c floatR">
                            
                                <label for="photo" class="point c-blu_h">
                                    <span class="block upload_img wid300 heig50 input_addSynagogue"> &nbsp
                                        <img id="vue_photo" class="wid50 heig50 disp-n" src="" alt="תמונה/לוגו" />
                                    </span>
                                    <span class="bold">הוסף תמונה/לוגו</span>
                                    <span class="help rel">
                                        <span class="btn_help"><i class="fas fa-question-circle"></i></span> <br>
                                        <span class="help_text disp-n">
                                            כדי להתאים לתצוגה, בחר תמונה ביחס לגודל 100 פיקסל על 100 פיקסל
                                        </span>
                                    </span>
                                </label>

                                <input type="file" name="photo" id="photo" class="disp-n input_img wid96pc bs" />
                                <span class="comment_error fs-13 col-r"></span> <br /> <br />

                            </div>

                            <div class="mar20-0 wid44pc ta-c floatL">

                                <label for="panoramic" class="point c-blu_h">
                                    <span class="block upload_img wid300 heig50 input_addSynagogue"> &nbsp
                                        <img id="vue_panoramic" class="wid200 heig50 disp-n" src="" alt="תמונה פנורמי" />
                                    </span>
                                    <span class="bold">הוסף תמונה פנורמי</span>
                                    <span class="help rel">
                                            <span class="btn_help"><i class="fas fa-question-circle"></i></span> <br>
                                            <span class="help_text disp-n">
                                                כדי להתאים לתצוגה, בחר תמונה ביחס לגודל 1024 פיקסל על 256 פיקסל
                                            </span>
                                        </span>
                                </label>

                                <input type="file" name="panoramic" id="panoramic" class="disp-n input_img wid96pc bs" />
                                <span class="comment_error fs-13 col-r"></span> <br />
                                
                            </div>

                            <div class="clear"></div>

                        </div>
                        
                        <div class="mar20-0 wid44pc">

                            <input type="checkbox" name="conditions" id="conditions" class="input_design input_addSynagogue" />
                            <span class="col-r">*</span>
                            <label for="conditions" class="fs-13">אני מאשר/ת שכל הפרטים שהזנתי נכונים</label> <br />
                            <span class="comment_error fs-13 col-r"></span> <br />
                            
                        </div>

                    </div>

                    <p class="mar0 col-r">* שדה חובה</p>

                    <div class="ta-c">
                        <input type="submit" value="הוסף" class="btn mar20-0 col-w c-yw_h ta-c pad9-40 bor_rad5" />
                    </div>

                </form>
            </div>
        </div>
    </div>`;
    return addSynagogue;
}

// conscruct select of day zmanim in window add tefila
function getSelectDayZmanim(tefilaType) {
    let selectArray = [
        '<option value="1">לפני הנץ החמה</option>',
        '<option value="2">לפני הדלקת נירות</option>',
        '<option value="3">אחרי הדלקת נירות</option>',
        '<option value="4">אחרי מנחה גדולה</option>',
        '<option value="5">לפני פלג המנחה</option>',
        '<option value="6">אחרי פלג המנחה</option>',
        '<option value="7">לפני השקיעה</option>',
        '<option value="8">אחרי השקיעה</option>',
        '<option value="9">אחרי צאת הכוכבים</option>',
        '<option value="10">אחרי ר"ת</option>',
    ];
    if (tefilaType == 1) {
        return [selectArray[0]];
    } else if (tefilaType == 2) {
        return [selectArray[3], selectArray[4], selectArray[5], selectArray[6]];
    } else if (tefilaType == 3) {
        return [selectArray[7], selectArray[8]];
    } else if (tefilaType == 4) {
        return [selectArray[1], selectArray[2], selectArray[3], selectArray[4], selectArray[5], selectArray[6]];
    } else if (tefilaType == 5) {
        return [selectArray[0]];
    } else if (tefilaType == 6) {
        return [selectArray[1], selectArray[2], selectArray[3], selectArray[4], selectArray[5], selectArray[6]];
    } else if (tefilaType == 7) {
        return [selectArray[8], selectArray[9]];
    }
}

// conscruct checkbox of days in window add tefila per days
function getDaysWeek(tefilaType) {
    let daysWeek = ['א', 'ב', 'ג', 'ד', 'ה'];
    if (tefilaType == 1){
        daysWeek.push('ו');
    }
    let checkBoxDays = '';
    daysWeek.forEach(function (item, index) {
        const checkBox = `<input type="checkbox" name="days" id="day${index + 1}" value="${index + 1}" checked /> <label for="day${index + 1}">${item}' </label>`
        checkBoxDays += checkBox;
    });
    if (tefilaType > 0 && tefilaType < 4) {
        return checkBoxDays;
    } else {
        return '';
    }
}

function htmlAddTefila(synagogueId, tefilaType) {

    // get the inputs per days
    const selectZmanim = getSelectDayZmanim(tefilaType);
    const checkBoxDays = getDaysWeek(tefilaType);
    let radioDays = '';
    if (checkBoxDays) {
        radioDays = 
        `<input type="radio" name="all_days" id="all_days" value="allDays" checked />
        <label for="all_days">כל יום</label>

        <input type="radio" name="all_days" id="partial_days" value="manyDays" />
        <label for="partial_days">ימים</label>`
    }

    // construct the window
    let windowAddTefila =
        `<div class="message_box">
			<div class="con-box wid700 allBor">
				<div class="btn_close col-w right--20 top-0">
					<i class="fas fa-times"></i>
				</div>
	
				<div class="con-header">
					<h4 class="col-w pad10-0 bc_blu-lin bor_rad5-top">
						הוסף תפילה
					</h4>
				</div>
	
				<!-- body -->
				<div class="con-body pad10">
	
					<form action="/synagogue/addTefila" method="post" id="add_tefila_form" class="ta-r">
	
						<div>
							<div class="mar20-0 wid44pc floatR">

								<label for="name">שם התפילה</label>
								<input type="text" name="name" id="name" placeholder="שם התפילה" class="input_design input_addTefila wid96pc bs" />
								<span class="comment_error fs-13 col-r"></span> <br />
	
							</div>
	
							<div class="mar20-0 wid44pc floatL">

								<input type="radio" name="hours" id="hours" value="fixed" checked />
								<label for="hours">שעה קבועה</label>
								<input type="time" name="hour" id="hour" class="input_design input_addTefila wid96pc bs" />
								<span class="comment_error fs-13 col-r"></span> <br />
	
							</div>

							<div class="mar20-0 wid44pc floatR">
	
								<input type="radio" name="hours" id="day_time" value="day_time" />
								<label for="day_time">שעה לפני/אחרי זמני היום</label>
								<input type="time" name="hour_day_time" id="hour_day_time" class="input_design input_addTefila wid96pc bs" disabled />
								<span class="comment_error fs-13 col-r"></span> <br />
	
							</div>
	
							<div class="mar20-0 wid44pc floatL">
	
								<label for="select_day_time">בחר זמני היום</label>
								<select name="day_hours" id="select_day_hours" class="input_addTefila wid96pc bs" disabled>
                                    <option value="0">-----</option>
                                    ${selectZmanim}
								</select>
								<span class="comment_error fs-13 col-r"></span> <br />
	
                            </div>
                            
	
							<div class="mar20-0 wid44pc floatR">
	
								${radioDays}
								
							</div>

							<div id="days_box" class="mar20-0 wid44pc floatL">
								
                                ${checkBoxDays}
								<span class="comment_error fs-13 col-r"></span> <br />

							</div>

							<div class="clear"></div>

						</div>
		
						<div class="ta-c">
							<input type="submit" value="הוסף" class="btn mar20-0 col-w c-yw_h ta-c pad9-40 bor_rad5" data-synagogueid="${synagogueId}" data-tefilatype="${tefilaType}" />
						</div>
	
					</form>
				</div>
			</div>
        </div>`;
    return windowAddTefila;
}

function addListSynagogue (object) {
    let divImg = '';
    if (object.photo) {
        divImg = `<img class="wid60x60 bor_rad5" src="/assets/img/BK/${object.photo}" alt="תמונת ${object.name}" />`
    }
    return `<li>
                <a href="/account/synagogue/${object._id}" class="in_block allBor mar10-0 col-bl c-blu_h shad_btn">

                    <span class="in_block wid60x60 pad5 floatR upload_img">
                        ${divImg}
                    </span>

                    <span class="block mar0-10 floatR">

                        <span class="block mar15-0 fs-20 bold">
                            ${object.name}
                        </span>

                        <span class="block wid250">
                            ${object.street} ${object.streetNumber} ${object.city}
                        </span>

                    </span>

                    <span class="clear"></span>
                </a>
            </li>`;
}

function buildSelectSearchTefila(val) {
    let selectArray = [];
    let select = '';
    if (val == 'week') {
        selectArray = [
            {value: 'week', name: 'הכל'},
            {value: 1, name: 'שחרית חול'},
            {value: 2, name: 'מנחה חול'},
            {value: 3, name: 'ערבית חול'},
        ];
    } else if (val == 'shabbat') {
        selectArray = [
            {value: 'shabbat', name: 'הכל'},
            {value: 4, name: 'מנחה ער"ש'},
            {value: 5, name: 'שחרית שבת'},
            {value: 6, name: 'מנחה שבת'},
            {value: 7, name: 'ערבית מוצ"ש'},
        ];
    }
    selectArray.forEach(item => {
        select += `<option value="${item.value}" >${item.name}</option>`;
    });
    return select;
}

function sendEmailForgotDiv(status) {
    return `
        <p>
            <i class="fas fa-check col-gn mar0-20"></i>
            הסיסמא נשלחה למייל שלך בהצלחה.
            <br>
            אם המייל לא נמצא בתקייה "דואר נכנס", נא ליבדוק בתקייה "ספאם".
        </p>`;
}

function process() { 
        return `<div class="message_box">
            <div class="loader"></div>
        </div>`;
}


export {
    htmlLoginRegist,
    alert,
    htmlAddSynagogue,
    htmlAddTefila,
    addListSynagogue,
    buildSelectSearchTefila,
    sendEmailForgotDiv,
    process
};