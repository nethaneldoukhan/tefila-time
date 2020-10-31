const mongoose = require('mongoose');
const debug = require('debug')('app:schema');

const weekTefilaSchema = new mongoose.Schema({
    synagogueId: String,
    tefila: Number,
    name: String,
    hour: Date,
    hour_day_time: Date,
    day_time: Number,
    weekDays: Array,
    createDate: Date
});
const WeekTefila = mongoose.model("WeekTefila", weekTefilaSchema);

module.exports = WeekTefila;