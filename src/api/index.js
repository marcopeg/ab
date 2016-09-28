
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser')

// database
mongoose.connect('mongodb://db/qa');

// server
let app = express();
app.use(express.static('/usr/src/html'));
app.use(bodyParser.json());
app.use('/cards', require('./routes/cards'));
app.listen(8080, () => console.log('Running 8080'));
