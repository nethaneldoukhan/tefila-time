const express = require('express');
const forgotRouter = express.Router();
const bcrypt = require('bcrypt');
const debug = require('debug')('app:forgot');
const { ObjectID } = require('mongodb');
const User = require('../schemas/UserSchema');
const pagesFunctions = require('../functions/pagesFunctions');
const sendEmailsFunctions = require('../functions/sendEmailsFunctions');
const e = require('express');




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
                    let user = '';
                    const token = Math.floor(Math.random() * 999999999999999) + 10000000;
                    user = await User.collection.findOne({ 'email': email});
                    debug(user);
                    debug(token);
                    if (user) {
                        user.resetPasswordToken = token.toString();
                        user.resetPasswordExpires = Date.now() + 3600000;
                        newUser = await User.collection.findOneAndUpdate( { _id: new ObjectID(user._id) }, { "$set": user });
                        debug(newUser);
                        debug(user);
                        if (newUser.ok === 1) {
                            const status = sendEmailsFunctions.forgotPass(user);
                            res.json(status);
                        } else {
                            res.json(50);
                        }
                    } else {
                        res.json(14);
                    }
                } catch (err) {
                    debug(err);
                    res.json(50);
                }
            })();
        });

    forgotRouter.route('/reset/:token')
        .get((req, res) => {
            const token = req.params.token;
                debug(token);
                (async () => {
                try {
                    const user = await User.collection.findOne({ 'resetPasswordToken': token, 'resetPasswordExpires': { $gt: Date.now() }});
                    debug(user);
                    if (user) {
                        const zmanim = await pagesFunctions.getAllZmanim(req, res);
                        const userDiv = pagesFunctions.userDiv(req);
                        res.render('pages/resetPassword', {
                            pageTitle: 'איפוס סיסמא ',
                            userDiv,
                            zmanim,
                            user,
                            search: ''
                        });
                    } else {
                        res.redirect('/forgot_password/?m=not_exist_reset')
                    }
                } catch (err) {
                    debug(err);
                }
            })();
        });
        
    forgotRouter.route('/update_password')
        .post((req, res) => {
            const password = req.body.password;
            const confirmPassword = req.body.confirm;
            const token = req.body.token;
            debug(token);
            debug(password);
            debug(confirmPassword);
            const validePassword = validPassword(password, confirmPassword);
            if (validePassword === 0) {
                (async () => {
                    try {
                        const user = await User.collection.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
                        if (user) {
                            user.password = await bcrypt.hash(password, 2)
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;
                            newUser = await User.collection.findOneAndUpdate( {_id: new ObjectID (user._id) }, { "$set": user});
                            if (newUser.ok === 1) {
                                res.json(0);
                            } else {
                                res.json(50);
                            }
                        } else {
                            res.json(2);
                        }
                    } catch (err) {
                        debug(err);
                        res.json(50);
                    }
                })();
            } else {
                res.json(validePassword);
            }
        });




    return forgotRouter;
}

function validPassword(password, confirmPassword) {
    if (password != confirmPassword || password.length < 8) {
        return 1;
    } else {
        return 0;
    }
}


module.exports = router;