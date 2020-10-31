const mongoose = require('mongoose');
const debug = require('debug')('app:schema');

const shabbatTefilaSchema = new mongoose.Schema({
    synagogueId: String,
    tefila: Number,
    name: String,
    hour: Date,
    hour_day_time: Date,
    day_time: Number,
    createDate: Date
});
const ShabbatTefila = mongoose.model("ShabbatTefila", shabbatTefilaSchema);

module.exports = ShabbatTefila;