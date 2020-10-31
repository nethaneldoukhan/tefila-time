const https = require('https');
const qs = require("querystring");
const fs = require('fs');
const express = require('express');
const adminRouter = express.Router();
const debug = require('DEBUG')('app:admin');
const {MongoClient,ObjectID} = require('mongodb');



function router(dataBase) {

    adminRouter.route('/add-post')
        .put((req, res) => {
            
            (async () => {
                debug(req.body)
            const post = {
                title: req.body.title,
                fullText: req.body.fullText
            };
            let client;
            try {

                client = await MongoClient.connect(dataBase.url);
                debug('Connect to Mango DB');
                const db = client.db(dataBase.dbName);
                // debug('Created Mango DB', client);
                const response = await db.collection('posts').insertOne(post);
                // debug(response);
                res.json(response);

            } catch (err) {
                debug('Error', err)
            }
            client.close();
            })();
        });

    adminRouter.route('/add-posts')
        .put((req, res) => {

            (async () => {
            let client;
            try {

                client = await MongoClient.connect(dataBase.url);
                debug('Connect to Mango DB');
                const db = client.db(dataBase.dbName);
                // debug('Created Mango DB', client);
                const response = await db.collection('posts').insertMany(postsArray);
                debug(response);
                res.json(response);

            } catch (err) {
                debug('Error', err)
            }
            client.close();
            })();
        });

    adminRouter.route('/del-posts')
        .delete((req, res) => {
            const id = req.params.id;
            debug(id);

            (async () => {
            let client;
            try {

                client = await MongoClient.connect(dataBase.url);
                debug('Connect to Mango DB');
                const db = client.db(dataBase.dbName);
                // debug('Created Mango DB', client);
                const response = await db.collection('posts').deleteMany();
                // debug(response);
                res.json(response);

            } catch (err) {
                debug('Error', err)
            }
            client.close();
            })();
        });

    adminRouter.route('/del-post/:id')
        .delete((req, res) => {
            const id = req.params.id;
            debug(id);

            (async () => {
            let client;
            try {

                client = await MongoClient.connect(dataBase.url);
                debug('Connect to Mango DB');
                const db = client.db(dataBase.dbName);
                // debug('Created Mango DB', client);
                const response = await db.collection('posts').deleteOne({ _id: new ObjectID(id) });
                // debug(response);
                res.json(response);

            } catch (err) {
                debug('Error', err)
            }
            client.close();
            })();
            // res.send('hello admin');
        });

    return adminRouter;
}

module.exports = router;