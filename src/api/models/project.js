
const mongoose = require('mongoose');

module.exports = mongoose.model('Project', {
    pid: String,
    question: String,
    pin: String,
});
