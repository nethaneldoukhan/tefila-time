const mongoose = require('mongoose')
const debug = require('debug')('app:schema');

const userSchema = new mongoose.Schema({
    lastName: String,
    firstName: String,
    email: String,
    username: String,
    password: String,
    roleUser: Number,
    token: String,
    createDate: Date,
    lastUpdateDate: Date
});
const User = mongoose.model("User", userSchema);

module.exports = User;