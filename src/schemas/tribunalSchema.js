const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const debug = require('debug')('app:schema');

const tribunalSchema = new mongoose.Schema({
    idUser: ObjectID,
    name: String,
    nameEn: String,
    rite: Number,
    street: String,
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
const Tribunal = mongoose.model("Tribunal", tribunalSchema);

module.exports = Tribunal;