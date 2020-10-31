const fs = require('fs');
const nodemailer = require('nodemailer');
const debug = require('debug')('app:sendEmails');


function forgotPass(doc) {
    const subject = 'Forgot Password';
    const body = '';
    
    sendMail(doc.email, subject, body)
}


async function sendMail(receiversEmail, subject, body) {

    // async..await is not allowed in global scope, must use a wrapper
    try {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'nsd.developpement', // generated ethereal user
                pass: 'sassi1980', // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"do_not_reply@tefila-time.com"', // sender address
            to: receiversEmail, // list of receivers
            subject: subject, // Subject line
            // text: "Hello world?", // plain text body
            html: body, // html body
        });

        debug("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch(err) {
        debug(err);
    }
}



module.exports = {
    forgotPass
};