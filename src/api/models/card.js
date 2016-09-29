
const mongoose = require('mongoose');

module.exports = mongoose.model('Card', {
    pid: String,
    text: String,
    type: String,
    weight: Number,
    order: Number,
});
