const express = require('express');
const accountRouter = express.Router();
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('app:account');
const User = require('../schemas/UserSchema');
const Synagogue = require('../schemas/SynagogueSchema');
const Tribunal = require('../schemas/TribunalSchema');
const Cours = require('../schemas/CoursSchema');
const pagesFunctions = require('../functions/pagesFunctions');
const getSynagogueData = require('../functions/pagesSynagogueFunctions');




function router() {

    accountRouter.use((req, res, next) => {
        if (req.user) {
            next();
        } else {
            const string = encodeURIComponent('not_connected');
            res.redirect('/?m=' + string);
        }
    });

    accountRouter.route('/')
        .get((req, res) => {
            (async () => {
                const idUser = req.user._id
                let accountArrays = {
                    synagogue: [],
                    tribunal: [],
                    cours: []
                };
                try {
                    const zmanim = await pagesFunctions.getAllZmanim(req, res);
                    const userDiv = pagesFunctions.userDiv(req);
                    accountArrays.synagogue = await Synagogue.collection.find({idUser: idUser}).toArray();
                    accountArrays.tribunal = await Tribunal.collection.find({idUser: idUser}).toArray();
                    accountArrays.cours = await Cours.collection.find({idUser: idUser}).toArray();
                    res.render('pages/account', {
                        pageTitle: 'החשבון שלי',
                        userDiv,
                        zmanim,
                        idUser,
                        accountArrays,
                        search: ''
                    });

                } catch (err) {
                    debug('Error', err)
                }
            })();

        });

    accountRouter.route('/synagogue/:id')
        .get((req, res) => {
            (async () => {
                try {
                    const id = req.params.id;
                    let syna = '';
                    try {
                        syna = await Synagogue.collection.findOne({ _id: ObjectId.createFromHexString(id)});
                    } catch (err) {
                        debug(err);
                    }
                    if (syna) {
                        if (req.user._id == syna.idUser) {
                            const synagogue = await getSynagogueData(id);
                            const zmanim = await pagesFunctions.getAllZmanim(req, res);
                            const userDiv = pagesFunctions.userDiv(req);
                            res.render('pages/synagogueManager', {
                                pageTitle: 'בית כנסת ' + synagogue.detail.name,
                                userDiv,
                                zmanim,
                                synagogue,
                                search: ''
                            });
                        } else {
                            const string = encodeURIComponent('not_allowed');
                            res.redirect('/synagogue/' + id + '?m=' + string);
                        }
                    } else {
                        res.redirect('/account?m=not_exist');
                    }
                } catch (err) {
                    debug('Error', err);
                }
            })();
        });


    accountRouter.route('/update_password')
        .post((req, res) => {
            const user = req.user;
            const password = req.body.password;
            const confirmPassword = req.body.confirm;
            const validePassword = validPassword(password, confirmPassword);
            if (validePassword === 0) {
                (async () => {
                    try {
                        const hashPassword =  await bcrypt.hash(password, 2);
                        newUser = await User.collection.findOneAndUpdate( {_id: ObjectId.createFromHexString(user._id) }, { "$set": { 'password': hashPassword }});
                        if (newUser.ok === 1) {
                            res.json(0);
                        } else {
                            res.json(50);
                        }
                    } catch (err) {
                        debug(err);
                        res.json(50);
                    }
                })();
            } else {
                res.json('Field/s not valid or empty');
            }
        });
        
    return accountRouter;
}

function validPassword(password, confirmPassword) {
    if (password != confirmPassword || password.length < 8) {
        return 1;
    } else {
        return 0;
    }
}

module.exports = router;