const express = require('express');
const postRouter = express.Router();
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:posts');

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


function router(nav, dataBase) {

  postRouter.route('/')
    .get((req, res) => {

      (async () => {
        let client;
        try {

          client = await MongoClient.connect(dataBase.url);
          debug('Connect to Mango DB');
          const db = client.db(dataBase.dbName);
          debug('123');
          const posts = await db.collection('posts').find().toArray();
          // debug(posts);
          res.render('pages/posts', {
            title: 'BLOG',
            content: posts,
            nav
          })

        } catch (err) {
          debug('Error', err)
        }
      })();

    });

  postRouter.route('/:id')
    .get((req, res) => {
      const id = req.params.id;

      (async () => {
        let client;
        try {

          client = await MongoClient.connect(dataBase.url);
          debug('Connect to Mango DB');
          const db = client.db(dataBase.dbName);
          debug('123');
          const post = await db.collection('posts').findOne({ _id: new ObjectID(id) });
          // debug(post);
          res.render('pages/post', {
            title: 'BLOG',
            content: post,
            nav
          })

        } catch (err) {
          debug('Error', err)
        }
      })();

      // res.render('pages/post', {
      //   title: posts[id].title,
      //   content: posts[id].text,
      //   fullContent: posts[id].fullText,
      //   nav
      // })
    });
  return postRouter;
}

module.exports = router;