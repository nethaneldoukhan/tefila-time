const express = require('express');
const accountRouter = express.Router();
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:account');
const Synagogue = require('../schemas/SynagogueSchema');
const Tribunal = require('../schemas/TribunalSchema');
const Cours = require('../schemas/CoursSchema');
const pagesFunctions = require('../functions/pagesFunctions');
const getSynagogueData = require('../functions/pagesSynagogueFunctions');


// const posts = [
//     {
//       title: 'Title1',
//       text: 'ghkjhk',
//       fullText: 'hljkhl jh kjhml jhkhm jhmkjh:m khnk:bn: nkjn:k :k,nb: :,nb ::,nb:'
//     },
//     {
//       title: 'Title2',
//       text: 'mlkjm',
//       fullText: 'mlkhnb jkgfcfhdxcj khgfcjgvckv khgvhbv; ,hvhv;'
//     },
//     {
//       title: 'Title3',
//       text: 'dg',
//       fullText: 'fdj gfgch jygfkfi fdgfdfgh gfcgj'
//     },
//     {
//       title: 'Title4',
//       text: 'dfgh',
//       fullText: 'ghjhfjhhg jhgfhgf hcgcjg jcgcj'
//     }
// ]


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
                    const zmanim = await pagesFunctions.getAllZmanim();
                    const userDiv = pagesFunctions.userDiv(req);
                    accountArrays.synagogue = await Synagogue.collection.find({idUser: idUser}).toArray();
                    accountArrays.tribunal = await Tribunal.collection.find({idUser: idUser}).toArray();
                    accountArrays.cours = await Cours.collection.find({idUser: idUser}).toArray();
                    debug(accountArrays);
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
                    debug(req.user._id);
                    debug(id);
                    let syna = '';
                    try {
                        syna = await Synagogue.collection.findOne({ _id: new ObjectID(id)});
                    } catch (err) {
                        debug(err);
                    }
                    if (syna) {
                        if (req.user._id == syna.idUser) {
                            const synagogue = await getSynagogueData(id);
                            const zmanim = await pagesFunctions.getAllZmanim();
                            const userDiv = pagesFunctions.userDiv(req);
                            debug('authorized')
                            debug(synagogue);
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
    return accountRouter;
}

module.exports = router;