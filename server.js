const https = require('https');
const fs = require('fs');
const express = require('express');
var cors = require('cors');
const requestIp = require('request-ip');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const debug = require('debug')('app:server')
const chalk = require('chalk');
const pagesFunctions = require('./src/functions/pagesFunctions');
const manageCookies = require('./src/functions/manageCookies');
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();
const connectionUrl = process.env.DB_URI;
const KosherZmanim = require("kosher-zmanim");
const upload = ('file-upload');
const sendMail = require('./src/functions/sendEmailsFunctions');



app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(session({secret: 'nm',
    resave: true,
    saveUninitialized: true
}));
app.use(fileUpload());
require('./src/config/passport.js')(app);
app.use(cors());
app.use(requestIp.mw());

app.use(express.static(path.join(__dirname, '/public')));
app.use(morgan('tiny'));

app.set('views', './src/views');
app.set('view engine', 'ejs');


// check token
// app.get('*', (req, res, next) => {
//     (async () => {
//         if (!req.user) {
//             const cookies = manageCookies.checkUserCookies(req);
//             if (cookies.status === 0) {
//                 const status = await manageCookies.signInToken(req, res);
//                 debug(status);
//             }
//         }
//         next();
//     })();
// });


const authRouter = require('./src/routes/authRoutes')();
const synagogueRouter = require('./src/routes/synagogueRoutes')();
const accountRouter = require('./src/routes/accountRoutes')();
const searchRouter = require('./src/routes/searchRoutes')();
const calendarRouter = require('./src/routes/calendarRoutes')();
const forgotRouter = require('./src/routes/forgotRoutes')();

app.use('/auth', authRouter);
app.use('/account', accountRouter);
app.use('/synagogue', synagogueRouter);
app.use('/search', searchRouter);
app.use('/calendar', calendarRouter);
app.use('/forgot_password', forgotRouter);



app.get('/', (req, res) => {
    (async () => {
        const traceUser = {
            referer: req.headers.referer,
            IP: req.clientIp
        };
        // debug(req.clientIp);
        sendMail.sendReferer(traceUser);
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
        const userDiv = pagesFunctions.userDiv(req);
        if(req.user) {
            res.json(req.user);
        } else {
            debug(zmanim);
            res.render('pages/conditions', {
                pageTitle: 'תנאי שימוש',
                userDiv,
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
app.get('*', (req, res) => {
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
        connectionUrl,
        {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true}
    )
    debug('Connected to db server');

    app.listen(port, () => {
        debug(`listening on port ${chalk.green(port)}`)
    });
}



module.exports = start;