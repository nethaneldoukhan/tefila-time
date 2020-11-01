const mongoose = require('mongoose');
const debug = require('debug')('app:schema');

const citySchema = new mongoose.Schema({
    cityNameEn: String,
    countryNameEn: String,
    cityNames: Array,
    countryNames: Array,
    timeZoneId: String,
    latitude: Number,
    longitude: Number,
    elevation: Number
});
const City = mongoose.model("City", citySchema);

module.exports = City;