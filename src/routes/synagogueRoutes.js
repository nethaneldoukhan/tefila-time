const express = require('express');
const https = require('https');
const fs = require('fs');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:synagogueRoutes');
const Synagogue = require('../schemas/SynagogueSchema');
const NewLetter = require('../schemas/newLetterSchema');
const WeekTefila = require('../schemas/WeekTefilaSchema');
const ShabbatTefila = require('../schemas/ShabbatTefilaSchema');
const pagesFunctions = require('../functions/pagesFunctions');
const getSynagogueData = require('../functions/pagesSynagogueFunctions.js');
// const getZmanim = require('../functions/getZmanim');
const synagogueRouter = express.Router();


function router() {

    synagogueRouter.route('/')
        .get((req, res) => {
            res.redirect('/');
        });

    synagogueRouter.route('/:id')
        .get((req, res) => {
            const id = req.params.id;
            (async () => {
                try {
                    const synagogue = await getSynagogueData(id);
                    if (synagogue) {
                        const zmanim = await pagesFunctions.getAllZmanim();
                        const userDiv = pagesFunctions.userDiv(req);
                        // debug(zmanim);
                        res.render('pages/synagogue', {
                            pageTitle: 'בית כנסת ' + synagogue.detail.name,
                            userDiv,
                            zmanim,
                            synagogue,
                            search: ''
                        });
                    } else {
                        res.redirect('/?m=not_exist')
                    }
                } catch (err) {
                debug('Error', err)
                }
            })();
        });

        
    synagogueRouter.route('/checkExistSynagogue')
        .post((req, res) => {
            const values = {
                name: req.body.name,
                street: req.body.street
            };
            debug(values);
            (async () => {
                let response = {
                    'status': '',
                    'message': ''
                };
                try {
                    const existSynagogue = await checkSynagogue(values);
                    if (existSynagogue === false) {
                        response.status = 0;
                        response.message = 'ok';
                        res.json(response);
                    } else {
                        response.status = 9;
                        response.message = 'synagogue already exist';
                        res.json(response);
                    }
                } catch (err) {
                    debug(err);
                    response.status = 50;
                    response.message = 'error';
                    res.json(response);
                }
            })();
        });


    synagogueRouter.route('/addSynagogue')
        .post((req, res) => {
            debug(req.files);
            debug(req.body);
            let synagogue = {
                idUser: req.user._id,
                name: req.body.name,
                nameEn: req.body.name_en,
                rite: req.body.rite,
                synagogueRoleUser: req.body.synagogueRoleUser,
                street: req.body.street,
                streetNumber: req.body.streetNumber,
                city: req.body.city,
                country: req.body.country,
                email: req.body.email,
                phone: req.body.phone,
                roleUser: 3,
                photo: '',
                panoramic: '',
                latitude: '',
                longitude: '',
                createDate: req.body.createDate,
                lastUpdateDate:  req.body.createDate
            };
            debug(synagogue);

            (async () => {
                let response = {
                    'status': '',
                    'tables': []
                }
                try {
                    const valuesOk = checkValues(synagogue);
                    if (valuesOk) {
                        const existSynagogue = await checkSynagogue(synagogue);
                        if (existSynagogue === false) {
                            await getGeolocation(synagogue);
                            const upload = uploadFiles(req, synagogue);
                            const addSynagogue = await insertSynagogue(synagogue);
                            debug('add');
                            response.status = 'ok';
                            response.tables = addSynagogue;
                            res.json(response);
                        } else {
                            response.status = 'Already exist';
                            res.json(response);
                        }
                    } else {
                            response.status = 'Field/s not valid or empty';
                            res.json(response);
                    }
                } catch (err) {
                    debug(err);
                    res.json(50);
                }
            })();
        });

    synagogueRouter.route('/deleteSynagogue')
        .delete((req, res) => {
            const dataId = req.body.dataId;
            debug(req.body);
            (async () => {
                let response = {
                    'status': '',
                    'result': ''
                }
                try {
                    // const data = await Synagogue.collection.findOne( {_id: new ObjectID(dataId) });
                    const allowedUser = await checkAllowedUser(req, dataId);
                    if (allowedUser) {
                        const removeAllSynagogueData = await deleteSynagogueData(dataId);
                        // debug('aaa', removeAllSynagogueData);
                        if (removeAllSynagogueData) {
                            await deleteImg(dataId);
                            const removeSynagogue = await deleteData(Synagogue, dataId);
                            if (removeSynagogue.n == 1) {
                                response.status = 'ok';
                                response.result = 'deleted';
                                res.json(response);
                            } else {
                                response.status = 'error';
                                response.result = 'אירעה שגיאה';
                                res.json(response);
                            }
                        } else {
                            response.status = 'error';
                            response.result = 'אירעה שגיאה';
                            res.json(response);
                        }
                    } else {
                        response.status = 'error';
                        response.result = 'אירעה שגיאה';
                        res.json(response);
                    }
                } catch (err) {
                    debug(err);
                    response.status = 'error';
                    response.result = 'אירעה שגיאה';
                    res.json(response);
                }
            })();
        });

    synagogueRouter.route('/addTefila')
    .post((req, res) => {
        let tefila = {
            synagogueId: req.body.synagogueId,
            tefilaType: req.body.tefilaType,
            name: req.body.name,
            hour: req.body.hour,
            hour_day_time: req.body.hour_day_time,
            day_hours: req.body.day_hours
        };
        if (req.body.days) {
            tefila.days = req.body.days
        };
        tefila.createDate = req.body.createDate;
        debug(tefila);
        (async () => {
            let response = {
                'status': '',
                'tables': []
            }
            try {
                const checkValues = checkValuesNewTefila(tefila);
                const allowedUser = await checkAllowedUser(req, tefila.synagogueId);
                if (checkValues && allowedUser) {
                    const tefilaCollection = getDataCollection(tefila.tefilaType);
                    const addTefila = await insertTefila(tefilaCollection, tefila);
                    if (addTefila[0]) {
                        Synagogue.collection.findOneAndUpdate( {_id: new ObjectID (req.body.synagogueId) }, { "$set": {'lastUpdateDate': req.body.createDate}});
                        response.status = 'ok';
                        response.tables = addTefila;
                    } else {
                        response.status = 'אירעה שגיאה';
                    }
                } else {
                    response.status = 'אירעה שגיאה';
                }
                res.json(response);
            } catch (err) {
                debug(err);
                response.status = 'אירעה שגיאה';
                res.json(response);
            }
        })();
    });

    
    synagogueRouter.route('/deleteData')
        .delete((req, res) => {
            const data = req.body;
            debug(req.body);
            (async () => {
                let response = {
                    'status': '',
                    'result': ''
                }
                try {
                    const collectionData = getDataCollection(req.body.dataType);
                    debug(collectionData);
                    const data = await collectionData.collection.findOne( {_id: new ObjectID(req.body.dataId) });
                    const allowedUser = await checkAllowedUser(req, data.synagogueId);
                    if (allowedUser) {
                        const removeData = await deleteData(collectionData, req.body.dataId);
                        if (removeData.n == 1) {
                            Synagogue.collection.findOneAndUpdate( {_id: new ObjectID (data.synagogueId) }, { "$set": {'lastUpdateDate': req.body.date}});
                            response.status = 'Ok';
                            response.result = removeData;
                            res.json(response);
                        } else {
                            response.status = 'Error';
                            response.result = 'אירעה שגיאה';
                            res.json(response);
                        }
                    } else {
                        response.status = 'Error';
                        response.result = 'אירעה שגיאה';
                        res.json(response);
                    }
                } catch (err) {
                    debug(err);
                    response.status = 'Error';
                    response.result = 'אירעה שגיאה';
                    res.json(response);
                }
            })();
        });

        
    synagogueRouter.route('/checkExistNewLetter')
        .post((req, res) => {
            const values = {
               synagogueId: req.body.synagogueId,
               email: req.body.email
            };
            debug(values);
            (async () => {
                let response = {
                    'status': ''
                }
                try {
                    const existNewLetter = await checkEmail(values);
                    if (existNewLetter === false) {
                        response.status = 'ok';
                        res.json(response);
                    } else {
                        response.status = 'Email already used for this synagogue';
                        res.json(response);
                    }
                } catch (err) {
                    debug(err);
                    response.status = 'error';
                    res.json(response);
                }
            })();
        });


    synagogueRouter.route('/addToNewLetter')
        .post((req, res) => {
            const addNewLetter = {
                synagogueId: req.body.synagogueId,
                email: req.body.email,
                createDate: req.body.createDate
            };
            debug(addNewLetter);
            (async () => {
                let response = {
                    'status': '',
                    'tables': []
                }
                try {
                    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    if (addNewLetter.email.match(mailFormat)) {
                        const existEmail = await checkEmail(addNewLetter);
                        if (existEmail === false) {
                            const results = await NewLetter.collection.insertOne(addNewLetter);
                            debug(results.ops[0]);
                            response.status = 'ok';
                            response.tables = results.ops;
                            res.json(response);
                        } else {
                            res.json('Already exist')
                        }
                    } else {
                        res.json('Field/s not valid or empty')
                    }
                } catch (err) {
                    debug('Error', err)
                }
            })();
        });

    // synagogueRouter.route('/synagogue?:q')
    //     .get((req, res) => {
    //         const q = req.query.q.split(' ');
    //         (async () => {
    //             try {
    //                 const regex = q.map(function (k) { return new RegExp(k) });
    //                 debug(regex);
    //                 const synagogues = await Synagogue.collection.find({
    //                     "$or": [{
    //                         "name": {"$in": regex}
    //                     }, {
    //                         "street": {"$in": regex}
    //                     }]}).toArray();
    //                 debug(synagogues);
    //                 res.json(synagogues);
    //                 // res.render('pages/search', {
    //                 //   title: 'BLOG',
    //                 //   content: posts,
    //                 //   nav
    //                 // })
    //             } catch (err) {
    //                 debug('Error', err)
    //             }
    //         })();
    //     });

    return synagogueRouter;
}

function checkValues(synagogue) {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const phoneFormat = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
    if (synagogue.idUser && synagogue.name 
        && synagogue.rite && synagogue.synagogueRoleUser
        && synagogue.synagogueRoleUser > 0 && synagogue.synagogueRoleUser < 5
        && synagogue.street 
        && synagogue.streetNumber && synagogue.city 
        && synagogue.country && synagogue.email 
        && synagogue.email.match(mailFormat) && synagogue.phone.match(phoneFormat) 
        && synagogue.roleUser && synagogue.roleUser == 3
        && synagogue.rite > 0 && synagogue.rite < 4) {
        return true;
    } else {
        return false;
    }
}

function checkValuesNewTefila(tefila) {
    if (tefila.tefilaType && tefila.tefilaType > 0 && tefila.tefilaType < 8 && tefila.name && tefila.synagogueId) {
        if (tefila.hour && tefila.hour_day_time || !tefila.hour && !tefila.hour_day_time) {
            return false;
        }
        if (tefila.hour_day_time && !tefila.day_hours || !tefila.hour_day_time && tefila.day_hours) {
            return false;
        }
        if (tefila.tefilaType < 4 && !tefila.days) {
            return false;
        } else if (tefila.tefilaType < 4 && !tefila.days[1]) {
            tefila.days = [tefila.days];
        }
        return true;
    } else {
        return false;
    }
}

async function checkAllowedUser(req, synagogueId) {
    const result = await Synagogue.collection.find({ _id: new ObjectID(synagogueId) }).toArray();
    debug(result);
    if (result[0].idUser == req.user._id) {
        debug('OK');
        return true;
    } else {
        debug('ERROR');
        return false;
    }
}

function getDataCollection(tefilaType) {
    if (tefilaType < 4) {
        return WeekTefila;
    } else {
        return ShabbatTefila;
    }
}

async function insertTefila(tefilaCollection, tefila) {
    const results = await tefilaCollection.collection.insertOne(tefila);
    debug(results.ops[0]);
    return results.ops;
}

async function deleteData(collection, dataId) {
    const results = await collection.collection.deleteOne({_id: new ObjectID(dataId) });
    return results.result;
}

async function deleteSynagogueData(dataId) {
    const resultsWeekTefila = await WeekTefila.collection.deleteMany({synagogueId: dataId });
    const resultsShabbatTefila = await ShabbatTefila.collection.deleteMany({synagogueId: dataId });
    const resultsNewLetter = await NewLetter.collection.deleteMany({synagogueId: dataId });
    debug(resultsNewLetter);
    if (resultsWeekTefila.result.ok == 1 && resultsShabbatTefila.result.ok == 1 && resultsNewLetter.result.ok == 1) {
        return true;
    } else {
        return false;
    }
}

async function checkEmail(addNewLetter) {
    const result = await NewLetter.collection.find({'synagogueId': addNewLetter.synagogueId, 'email': addNewLetter.email}).toArray();
    debug(result);
    if (result[0]) {
        debug('exist');
        return true;
    } else {
        debug('not exist');
        return false;
    }
}

async function checkSynagogue(synagogue) {
    const result = await Synagogue.collection.find({'name': synagogue.name, 'street': synagogue.street}).toArray();
    debug(result);
    if (result[0]) {
        debug('exist');
        return true;
    } else {
        debug('not exist');
        return false;
    }
}

function getGeolocation(synagogue) {
    const adress = encodeURIComponent(synagogue.street + '+' + synagogue.number + '+' + synagogue.city);
    return new Promise((resolve, reject) => {
        const option = {
            hostname: 'maps.googleapis.com',
            path: `/maps/api/geocode/json?address=${adress}&sensor=true&key=AIzaSyCzixLXCXnqK5EIoh3ydBBzp-0ltX3EhjA`
            };
        const request = https.get(option, (response) => {
            let body = '';

            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                const data = JSON.parse(body).results[0].geometry.location;
                debug(data);
                synagogue.latitude = data.lat;
                synagogue.longitude = data.lng;
                debug(synagogue);
                resolve();
            });
        });
        request.end();
    });
}

function uploadFiles(req, synagogue) {
    if (req.files && req.files.photo && req.files.photo.size < 2000000) {
        let photo = req.files.photo;
        const newName = (Math.floor(Math.random() * 99999999) + 10000000);
        photo.name = newName + '_' + photo.name.replace(/ /g,'_');
        const photoUploadPath = 'public/assets/img/bk/' + photo.name;
        photo.mv(photoUploadPath, function(err) {
            if (err) {
                return 'Error upload photo';
            }
        });
        synagogue.photo = photo.name;
        debug('upload photo');
    }
    if (req.files && req.files.panoramic && req.files.panoramic.size < 2000000) {
        let panoramic = req.files.panoramic;
        const newName = (Math.floor(Math.random() * 99999999) + 10000000);
        panoramic.name = newName + '_' + panoramic.name.replace(/ /g,'_');
        const panoramicUploadPath = 'public/assets/img/panoram/' + panoramic.name;
        panoramic.mv(panoramicUploadPath, function(err) {
            if (err) {
                return 'Error upload panoramic';
            }
        });
        synagogue.panoramic = panoramic.name;
        debug('upload panoramic');
    }
}

async function insertSynagogue(synagogue) {           
    const results = await Synagogue.collection.insertOne(synagogue);
    debug(Synagogue);
    debug(results.ops[0]);
    return results.ops;
}

async function deleteImg(synagogueId) {
    const dataSynagogue = await Synagogue.collection.findOne( {_id: new ObjectID(synagogueId) });
    if (dataSynagogue.photo) {
        deleteFile('public/assets/img/BK/' + dataSynagogue.photo);
    }
    if (dataSynagogue.panoramic) {
        deleteFile('public/assets/img/panoram/' + dataSynagogue.panoramic);
    }
}

function deleteFile(path) {
    fs.unlink(path, function (err) {
        if (err) throw err;
        debug('Delete!', path);
    });
}

module.exports = router;