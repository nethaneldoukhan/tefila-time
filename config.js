const debug = require('debug')('app:config')
const dotenv = require('dotenv')
dotenv.config()


const ENV = process.env.ENV
const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000
const DB_URI = process.env.DB_URI


const JWT = process.env.JWT

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const ELEVATION_API = process.env.ELEVATION_API
const TIME_ZONE_API = process.env.TIME_ZONE_API




module.exports = {
    ENV,
    HOST,
    PORT,
    DB_URI,
    JWT,
    GOOGLE_API_KEY,
    ELEVATION_API,
    TIME_ZONE_API
}