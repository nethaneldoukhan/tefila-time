const express = require('express');
const forgotRouter = express.Router();
const debug = require('debug')('app:forgot');
const User = require('../schemas/UserSchema');
const pagesFunctions = require('../functions/pagesFunctions');
const sendEmailsFunctions = require('../functions/sendEmailsFunctions');




function router() {

    forgotRouter.route('/')
        .get((req, res) => {
            (async () => {
                const zmanim = await pagesFunctions.getAllZmanim(req, res);
                const userDiv = pagesFunctions.userDiv(req);
                debug(zmanim);
                res.render('pages/forgotPass', {
                    pageTitle: 'שכחתי סיסמא',
                    userDiv,
                    zmanim,
                    search: ''
                });
            })();
        });

    forgotRouter.route('/sendForgotEmail')
        .post((req, res) => {
            (async () => {
                try {
                    const email = req.body.email;
                    debug(email);
                    let doc = '';
                    try {
                        doc = await User.collection.findOne({ 'email': email});
                        debug(doc);
                    } catch (err) {
                        debug(err);
                    }
                    if (doc) {
                        const status = sendEmailsFunctions.forgotPass(doc);
                        res.json(status);
                    } else {
                        res.json(14);
                    }
                } catch (err) {
                    debug('Error', err);
                    res.json(50);
                }
            })();
        });
    return forgotRouter;
}


module.exports = router;