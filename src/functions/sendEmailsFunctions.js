const fs = require('fs');
const nodemailer = require('nodemailer');
const debug = require('debug')('app:sendEmails');


function forgotPass(doc) {
    const subject = 'Forgot Password';
    const body = '';
    
    sendMail(doc.email, subject, body)
}


async function sendMail(receiversEmail, subject, body) {

    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'nsd.developpement',
                pass: 'sassi1980',
            },
        });

        let info = await transporter.sendMail({
            from: '"do_not_reply@tefila-time.com"', // sender address
            to: receiversEmail, // list of receivers
            subject: subject, // Subject line
            // text: "Hello world?", // plain text body
            html: body, // html body
        });

        debug("Message sent: %s", info.messageId);
    } catch(err) {
        debug(err);
    }
}



module.exports = {
    forgotPass
};