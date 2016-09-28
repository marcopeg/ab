
const mongoose = require('mongoose');

module.exports = mongoose.model('Card', {
    text: String,
    type: String,
    order: Number,
});
