const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const debug = require('debug')('app:authRoutes');
const User = require('../schemas/UserSchema');
const manageCookies = require('../functions/manageCookies');


const authRouter = express.Router();

function router() {
    authRouter.route('/sign-up')
        .put((req, res) => {
            (async () => {
                const user = {
                    lastName: req.body.lName,
                    firstName: req.body.fName,
                    email: req.body.email,
                    password: await bcrypt.hash(req.body.password, 2),
                    roleUser: req.body.roleUser,
                    token: req.body.token,
                    createDate: req.body.createDate,
                    lastUpdateDate: ''
                };
                let response = {
                    'status': '',
                    'tables': []
                }
                try {
                    const valuesOk = checkValues(user);
                    if (valuesOk) {
                        const existUser = await checkExistEmail(user);
                        if (existUser === false) {
                            const addUser = await insertUser(user);
                            response.status = 'ok';
                            response.tables = addUser;
                            res.json(response);
                        } else {
                            response.status = 'Email already used';
                            res.json(response);
                        }
                    } else {
                        response.status = 'Field/s not valid or empty';
                        res.json(response);
                }
                } catch (err) {
                    debug(err);
                    response.status = 'error';
                    res.json(response);
                }
            })();
        });

    authRouter.route('/profile')
        .get((req, res) => {
            if (req.user) {
                res.json(req.user);
            } else {
                res.json(1);
            }
        });


    authRouter.route('/sign-in')
        // .post(passport.authenticate('local', {
        //     successRedirect: '/auth/profile',
        //     failureRedirect: '/auth/profile'
        // }));
        .post((req, res) => {
            (async () => {
                const user = {
                    email: req.body.email,
                    password: req.body.password,
                    keepCon: req.body.keep_con
                };

                try {
                    const result = await User.collection.findOne({'email': user.email});
                    if(result) {
                        const isMatch = await bcrypt.compare(user.password, result.password);
                        if (isMatch) {
                            req.login(result, () => {
                                if(user.keepCon === 'true') {
                                    manageCookies.addUserCookies(result, req, res);
                                }
                            });
                        } else { }
                    }
                    res.redirect('/auth/profile');
                } catch (e) {
                    debug(e);
                }
            })();
        });


    authRouter.route('/logout')
        .get((req, res) => {
            req.logout();
            res.clearCookie('username');
            res.clearCookie('token');
            res.redirect('/');
        });

    authRouter.route('/checkExistEmail')
        .post((req, res) => {
            const email = req.body.email;
            (async () => {
                let response = {
                    'status': ''
                }
                try {
                    const existUser = await checkExistEmail(email);
                    if (existUser === false) {
                        response.status = 'ok';
                        res.json(response);
                    } else {
                        response.status = 'Email already used';
                        res.json(response);
                    }
                } catch (err) {
                    debug(err);
                    response.status = 'error';
                    res.json(response);
                }
            })();
        });

    return authRouter;
}

function checkValues(user) {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (user.lastName && user.firstName && user.email && user.password && user.token && user.createDate
        && user.email.match(mailFormat) && user.password.length > 7) {
        return true;
    } else {
        return false;
    }
}

async function checkExistEmail(email) {
    const result = await User.collection.find({'email': email}).toArray();
    if (result[0]) {
        return true;
    } else {
        return false;
    }
}

async function insertUser(user) {
    const results = await User.collection.insertOne(user);
    return results.ops;
}

module.exports = router;