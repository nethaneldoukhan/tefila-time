const fs = require('fs');
const nodemailer = require('nodemailer');
const { HOST } = require('../../config');
const debug = require('debug')('app:sendEmails');


async function forgotPass(user) {
    const subject = 'שיחזור סיסמא';
    const email = buildForgotPassEmail(subject, user);
    
    const status = await sendMail(user.email, subject, email);
    return status;
}

function sendReferer(traceUser) {
    const subject = 'Referer';
    const email = buildSendReferer(subject, traceUser);
    // debug(email);
    sendMail('natdoukhan@gmail.com', subject, email);
}


async function sendMail(receiversEmail, subject, email) {

    try {
        let transporter = nodemailer.createTransport({
            // host: "smtp.gmail.com",
            host: 'smtp.mail.yahoo.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                // user: 'nsd.developpement',
                user: 'natdoukhan',
                // pass: 'sassi1980',
                // pass: 'nati1980',drwmaoimugqdstll
                pass: 'drwmaoimugqdstll',
            },
        });

        let info = await transporter.sendMail({
            // from: '"no-reply@tefila-time.com" <nsd.developpement@tefila-time.com>', // sender address
            from: '"no-reply@tefila-time.com" <natdoukhan@yahoo.fr>', // sender address
            to: receiversEmail, // list of receivers
            subject: subject, // Subject line
            text: email.text, // plain text body
            html: email.html, // html body
        });

        debug("Message sent: %s", info);
        return 0;
    } catch(err) {
        debug(err);
        return 50;
    }
}

function buildSendReferer(title, data) {

    let body = 
        `<tbody>

            <tr>
                <td style="padding: 20px 30px;">
                    REFERER: ${data.referer} <br>
                    IP: ${data.IP}
                </td>
            </tr>

        </tbody>`;

    const emailHtml = templateEmail(title, body, false);

    const emailText = `REFERER: ${data.referer} <br> IP: ${data.IP}`;
    return {html: emailHtml, text: emailText};
}

function buildForgotPassEmail(title, user) {

    let body = 
        `<tbody>

            <tr>
                <td colspan="0" style="padding: 40px 30px 20px;">
                    <span style="color: #066093;font-size: 18px;">
                        שלום ${user.firstName},
                    </span>
                </td>
            </tr>

            <tr>

                <td style="padding: 20px 30px;">
                    נשלח לך דוא"ל זה לפי בקשתך לאפס את סיסמתך בתפילה טיים.
                </td>
            </tr>

            <tr>
                <td style="padding: 20px 30px;">
                    נא לילחוץ על קישור זה להשלים את התהליך: <br>
                    ${HOST}forgot_password/reset/${user.resetPasswordToken} <br>
                    או להעתיק אותו בדפדפן.
                </td>
            </tr>

            <tr>
                <td style="padding: 20px 30px;">
                    הקישור יפוג תוך שעה מקבלת מייל זה.
                </td>
            </tr>

            <tr>
                <td style="padding: 20px 30px;">
                    אם קבלת מייל זה ולא בקשת לאפס את סיסמתך, נא להתעלם. אך ליתר ביטחון, עדיף לך לשנות את
                    סיסמתך.
                </td>
            </tr>

            <tr>
                <td style="padding: 20px 30px;font-size: 10px;">
                    <hr align="right" width="300px">
                    *אין להשיב למייל זה. <br>
                    מייל זה נשלח באופן אוטומטי ולא תתקבל תשובה.
                </td>
            </tr>

        </tbody>`;

    const emailHtml = templateEmail(title, body, false);

    const emailText =
        `לוח זמני תפילות ושיעורי תורה




        שלום ${user.fName},
        
        נשלח לך דוא"ל זה לפי לבקשתך לקבל את הסיסמא שלך בתפילה טיים.
        <br>
        אם קבלת מייל זה ולא בקשת לקבל את הסיסמא שלך, נא להתעלם ממייל זה. אך ליתר ביטחון, עדיף לך לשנות את
        הסיסמא שלך.
        
        הסיסמא שלך היא: ${user.password}.
        
        נא לחזור לאתר תפילה טיים ולהכניס את הסיסמא שלך
        <br>
        http://tefila-time.com.
        
        *אין להשיב למייל זה. <br>
        מייל זה נשלח באופן אוטומטי ולא תתקבל תשובה.
        
        לשאילות או עזרה נא לפנות לאתר http://tefila-time.com/faq
        <br>
        
        או לשאול אותנו במייל: support@tefila-time.com
        
        <br>
        או לשלוח הודעה בוואטסאפ: 00972-525-817-356
        
        אתה מקבל דוא"ל זה כי אתה רשום לניוזלטר.
        להסרה לחץ כאן: http://tefila-time.com/unsuscribe.
        
        &copy תפילה טיים.`;
    return {html: emailHtml, text: emailText};
}

function templateEmail(title, message, unsuscribe) {

    let unsuscribeDiv = '';
    if (unsuscribe) {
        unsuscribeDiv =
            `<tr>
                <td align="center" style="font-size: 10px;padding: 0px 30px;">
                    אתה מקבל דוא"ל זה כי אתה רשום לניוזלטר.
                    להסרה לחץ כאן:
                    <br class="resLine">
                    <a href="http://tefila-time.com/unsuscribe" target="_blank"
                        style="color: white; font-size: 10px;">
                        http://tefila-time.com/unsuscribe
                    </a>
                    .
                </td>
            </tr>`
    }
    const templateEmail =
    `<!usertype html>
    <html lang="he" >
    
    <head>
        <title>${title}</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
            @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;700&display=swap');
    
            * {
                font: 14px/16px 'Heebo', sans-serif;
                direction: rtl;
            }
    
            body,
            html {
                margin: 0;
                padding: 0;
            }
    
            #title_site {
                font-size: 2em;
                font-weight: bold;
            }
    
            .resLine {
                display: none;
            }
    
            @media screen and (max-width: 527px) {
    
                #title_site {
                    font-size: 19px;
                }
    
                .logo {
                    width: 80px !important;
                }
    
                .resLine {
                    display: inline;
                }
            }
        </style>
    </head>
    
    <body>
    
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px;"
            id="bodyTable">
            <thead>
                <tr>
    
                    <td align="center" valign="top">
    
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" id="emailContainer"
                            style="font-family:Arial; color: #333333;">
    
                            <tbody>
    
                                <!-- Logo -->
                                <tr>
    
                                    <td align="right" colspan="0"
                                        style="width: 100px; padding: 10px; text-align: center; vertical-align: center;">
    
                                        <a href="http://tefila-time.com">
                                            <img class="logo" src="https://i.ibb.co/TbWdHPw/LogoSite.png" alt="LogoSite"
                                                border="0" style='width:100px;text-align:center;vertical-align:center;'>
                                        </a>
    
                                    </td>
    
                                    <!-- Title -->
    
                                    <td align="right" colspan="0"
                                        style="padding: 10px; text-align: right  vertical-align: center;">
    
                                        <span id="title_site">
                                            לוח זמני תפילות ושיעורי תורה
                                        </span>
    
                                    </td>
    
                                </tr>
    
                            </tbody>
                        </table>
                    </td>
                </tr>
            </thead>
    
            <!-- Messages  tbody-->
            ${message}

    
            <!-- footer -->
            <tfoot>
    
                <tr>
    
                    <td>
                        <table border="0" align="center" width="100%"
                            style="background: #066093 linear-gradient(to bottom, #066093 26%, #2e87b9 100%);">
                            <tbody>
    
                                <tr>
                                    <td align="center" style="padding: 10px;">
                                        <span style="color: black; font-size: 10px;">
                                            לשאילות או עזרה נא לפנות לאתר <a href="http://tefila-time.com/faq"
                                                target="_blank" style="color: white; font-size: 10px;">
                                                http://tefila-time.com/faq
                                            </a>
                                            <br>
                                            או לשאול אותנו במייל: 
                                            <a href="mailto:support@tefila-time.com"
                                                style="color: white; font-size: 10px;">
                                                support@tefila-time.com
                                            </a>
                                        </span>
                                    </td>
                                </tr>
    
                                ${unsuscribeDiv}
                                
                                <tr>
                                    <td align="center" style="font-size: 10px;">
                                    &copy; תפילה טיים
                                    </td>
                                </tr>
    
                            </tbody>
                        </table>
                    </td>
    
                </tr>
            </tfoot>
    
        </table>
    
    </body>
    
    </html>`;
    return templateEmail;
}



module.exports = {
    forgotPass,
    sendReferer
};