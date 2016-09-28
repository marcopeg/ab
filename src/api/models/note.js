
const mongoose = require('mongoose');

let Note = mongoose.model('Cat', {
    text: String,
    type: String,
});

module.exports = Note;
