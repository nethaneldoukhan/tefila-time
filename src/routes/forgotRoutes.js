const express = require('express');
const forgotRouter = express.Router();
const debug = require('debug')('app:forgot');
const User = require('../schemas/UserSchema');
const pagesFunctions = require('../functions/pagesFunctions');
const sendEmailsFunctions = require('../functions/sendEmailsFunctions');




function router() {

    // accountRouter.use((req, res, next) => {
    //     if (req.user) {
    //         next();
    //     } else {
    //         const string = encodeURIComponent('not_connected');
    //         res.redirect('/?m=' + string);
    //     }
    // });

    forgotRouter.route('/')
        .get((req, res) => {
            (async () => {
                const zmanim = await pagesFunctions.getAllZmanim();
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
                        sendEmailsFunctions.forgotPass(doc);
                        res.json(0);
                    } else {
                        res.json(1);
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