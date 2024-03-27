const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const debug = require('debug')('app:schema');

const synagogueSchema = new mongoose.Schema({
    // idUser: ObjectID,
    name: String,
    nameEn: String,
    rite: Number,
    street: String,
    synagogueRoleUser: Number,
    streetNumber: Number,
    city: String,
    country: String,
    email: String,
    phone: Number,
    roleUser: Number,
    photo: String,
    panoramic: String,
    latitude: Number,
    longitude: Number,
    createDate: Date,
    lastUpdateDate: Date
});
const Synagogue = mongoose.model("Synagogue", synagogueSchema);

module.exports = Synagogue;