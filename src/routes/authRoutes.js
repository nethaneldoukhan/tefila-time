const express = require('express');
const passport = require('passport');
const debug = require('debug')('app:authRoutes');
const User = require('../schemas/UserSchema');

const authRouter = express.Router();

function router() {
    authRouter.route('/sign-up')
        .put((req, res) => {
            const user = {
                lastName: req.body.lName,
                firstName: req.body.fName,
                email: req.body.email,
                password: req.body.password,
                roleUser: req.body.roleUser,
                token: req.body.token,
                createDate: req.body.createDate,
                lastUpdateDate: ''
            };
            debug(user);
            (async () => {
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
                debug('authorized')
                res.json(req.user);
                // debug(req.user);
            } else {
                res.json(1);
            }
        });

    authRouter.route('/sign-in')
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile',
            failureRedirect: '/auth/profile'
        }));


    authRouter.route('/logout')
        .get((req, res) => {
            req.logout();
            debug(req.user);
            res.redirect('/');
        });

    authRouter.route('/checkExistEmail')
        .post((req, res) => {
            const email = req.body.email;
            debug(email);
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
    debug(result);
    if (result[0]) {
        debug('exist');
        return true;
    } else {
        debug('not exist');
        return false;
    }
}

async function insertUser(user) {
    const results = await User.collection.insertOne(user);
    debug(results.ops[0]);
    return results.ops;
}

module.exports = router;