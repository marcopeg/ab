
const mongoose = require('mongoose');

let Note = mongoose.model('Note', {
    text: String,
    type: String,
    order: Number,
});

module.exports = Note;
