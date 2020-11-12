const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan')
const debug = require('debug')('app:server')
const chalk = require('chalk');
const pagesFunctions = require('./src/functions/pagesFunctions');
const port = 3000;
const dataBase = {url: 'mongodb://localhost:27017', dbName: 'tefilaTime'};
const KosherZmanim = require("kosher-zmanim");
const upload = ('file-upload');
const Synagogue = require('./src/schemas/SynagogueSchema');


const authRouter = require('./src/routes/authRoutes')();
const synagogueRouter = require('./src/routes/synagogueRoutes')();
const accountRouter = require('./src/routes/accountRoutes')();
const searchRouter = require('./src/routes/searchRoutes')();
const calendarRouter = require('./src/routes/calendarRoutes')();
const forgotRouter = require('./src/routes/forgotRoutes')();
const fileUpload = require('express-fileupload');



app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(session({secret: 'nm'}));
app.use(fileUpload());
require('./src/config/passport.js')(app);
app.use('/auth', authRouter);
app.use('/account', accountRouter);
app.use('/synagogue', synagogueRouter);
app.use('/search', searchRouter);
app.use('/calendar', calendarRouter);
app.use('/forgot_password', forgotRouter);

app.use(express.static(path.join(__dirname, '/public')));
app.use(morgan('tiny'));

app.set('views', './src/views');
app.set('view engine', 'ejs');




app.get('/', (req, res) => {
    (async () => {
        const areaData = await pagesFunctions.getSlideArea();
        // debug(areaData);
        const synagogues = await pagesFunctions.getSynagogueHomePage();
        const zmanim = await pagesFunctions.getAllZmanim(req, res);
        const userDiv = pagesFunctions.userDiv(req);
        console.log(req.cookies);
        res.render('pages/index', {
            pageTitle: 'דף הבית',
            userDiv,
            zmanim,
            synagogues,
            areaData,
            search: ''
        });
    })();
});

app.get('/faq', (req, res) => {
    (async () => {
        const zmanim = await pagesFunctions.getAllZmanim(req, res);
        const userDiv = pagesFunctions.userDiv(req);
        debug(zmanim);
        res.render('pages/faq', {
            pageTitle: 'שו"ת',
            userDiv,
            zmanim,
            search: ''
        });
    })();
});

app.get('/conditions', (req, res) => {
    (async () => {
        const zmanim = await pagesFunctions.getAllZmanim(req, res);
        if(req.user) {
            res.json(req.user);
        } else {
            debug(zmanim);
            res.render('pages/conditions', {
                pageTitle: 'תנאי שימוש',
                zmanim,
                search: ''
            });
        }
    })();
});

app.get('/contact_us', (req, res) => {
    (async () => {
        const zmanim = await pagesFunctions.getAllZmanim(req, res);
        const userDiv = pagesFunctions.userDiv(req);
        debug(zmanim);
        res.render('pages/contact_us', {
            pageTitle: 'צור קשר',
            userDiv,
            zmanim,
            search: ''
        });
    })();
});

// 404 page
app.use(function (req, res) {
    (async () => {
        const zmanim = await pagesFunctions.getAllZmanim(req, res);
        const userDiv = pagesFunctions.userDiv(req);
        res.status(404).render('pages/error', {
            pageTitle: 'דף לא נמצא',
            userDiv,
            zmanim,
            search: ''
        });
    })();
});



const start = async () => {
    await mongoose.connect(
        // 'mongodb://127.0.0.1/tefilaTime', //local
        'mongodb+srv://nati:nati1980.@tefilatime.hkuvn.mongodb.net/tefilaTime?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true', // serveur
        {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true}
    )
    debug('Connected to db server');

    app.listen(port, () => {
        debug(`listening on port ${chalk.green(port)}`)
    });
}



module.exports = start;