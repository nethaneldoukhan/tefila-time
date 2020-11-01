const mongoose = require('mongoose')
const debug = require('debug')('app:schema');

const newLetterSchema = new mongoose.Schema({
    synagogueId: String,
    email: String,
    createDate: Date
});
const NewLetter = mongoose.model("NewLetter", newLetterSchema);

module.exports = NewLetter;