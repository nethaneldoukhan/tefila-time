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
// const { ZmanimCalendar } = require('kosher-zmanim');
const port = 3000;
const dataBase = {url: 'mongodb://localhost:27017', dbName: 'tefilaTime'};
// const { ComplexZmanimCalendar, getZmanimJson } = require("kosher-zmanim");
const KosherZmanim = require("kosher-zmanim");
const upload = ('file-upload');
const Synagogue = require('./src/schemas/SynagogueSchema');


const postRouter = require('./src/routes/postRoutes')(dataBase); // peux rajouter un parmettre
const authRouter = require('./src/routes/authRoutes')(dataBase);
const adminRouter = require('./src/routes/adminRoutes')(dataBase); // ""
const synagogueRouter = require('./src/routes/synagogueRoutes')(dataBase); // ""
const accountRouter = require('./src/routes/accountRoutes')(dataBase); // ""
const searchRouter = require('./src/routes/searchRoutes')(dataBase); // ""
const calendarRouter = require('./src/routes/calendarRoutes')(dataBase); // ""
const forgotRouter = require('./src/routes/forgotRoutes')(dataBase); // ""
const fileUpload = require('express-fileupload');

// const calendarRouter = require('./src/routes/adminRoutes')(dataBase); // ""


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(session({secret: 'nm'}));
app.use(fileUpload());
require('./src/config/passport.js')(app);
app.use('/posts', postRouter);
app.use('/admin', adminRouter);
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

// async function getFirstZmanim() {
//     try {
//         const zmanim = await getZmanim(new Date(), 'jerusalem');
//         debug(zmanim);
//         addToJson(zmanim, 'zmanim.json');
//         // const parasha = await getParasha(new Date(), 'jerusalem');
//         // debug(parasha);
//     } catch (e) {
//         debug(e);
//     }
// }

// var option = {
//     date: new Date(),
//     timeZoneId: 'Asia/Jerusalem',
//     locationName: 'Jerusalem',
//     latitude: 31.768319,
//     longitude: 35.21371,
//     elevation: 778.2998,
//     complexZmanim: false
// };

// const zmanimCalendar = new KosherZmanim.ZmanimCalendar(option);
// debug(zmanimCalendar);

app.get('/', (req, res) => {
    (async () => {
        const areaData = await pagesFunctions.getSlideArea();
        debug(areaData);
        const synagogues = await pagesFunctions.getSynagogueHomePage();
        const zmanim = await pagesFunctions.getAllZmanim();
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
        const zmanim = await pagesFunctions.getAllZmanim();
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
        const zmanim = await pagesFunctions.getAllZmanim();
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
        const zmanim = await pagesFunctions.getAllZmanim();
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


// const { ComplexZmanimCalendar, getZmanimJson } = require("kosher-zmanim");
// const KosherZmanim = require("kosher-zmanim");
// const { DateTime } = require("luxon");

// const time = new Date();
// const date = DateTime.local().setZone('America/New_York').minus({ weeks: 1 }).endOf('day').toISO()
// console.log(date);

// const loc = AstronomicalCalendar.getGeoLocation('jerusalem');
// console.log(loc);
// const zmanimCalendar = new KosherZmanim.ZmanimCalendar();



module.exports = start;