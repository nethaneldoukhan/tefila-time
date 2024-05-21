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
const KosherZmanim = require("kosher-zmanim");
const upload = ('file-upload');
const sendMail = require('./src/functions/sendEmailsFunctions');
const { ENV, PORT, DB_URI, JWT } = require('./config')

let DB_ERROR = ''



app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: JWT,
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

app.use((req, res, next) => {
    if (DB_ERROR) {
        sendMail.sendError('Failed to connected to db server', DB_ERROR)
        res.status(500).render('pages/errorDB', {
            pageTitle: 'Error'
        })
    } else {
        next()
    }
})

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
        // const traceUser = {
        //     referer: req.headers.referer,
        //     IP: req.clientIp
        // };
        // sendMail.sendReferer(traceUser);
        const areaData = await pagesFunctions.getSlideArea();
        const synagogues = await pagesFunctions.getSynagogueHomePage();
        const zmanim = await pagesFunctions.getAllZmanim(req, res);
        const userDiv = pagesFunctions.userDiv(req);
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
        if (req.user) {
            res.json(req.user);
        } else {
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
    try {
        await mongoose.connect(
            // 'mongodb://127.0.0.1/tefilaTime', //local
            DB_URI,
        )
        debug('Connected to db server');
    } catch (err) {
        debug('Failed to connected to db server: ', err);
        DB_ERROR = err
        sendMail.sendError('Failed to connected to db server', err)
    }

    app.listen(PORT, () => {
        debug(`listening on port ${chalk.green(PORT)}`)
    });
}



module.exports = start;