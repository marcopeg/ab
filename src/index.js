
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser')

// database
mongoose.connect('mongodb://db/qa');

// server
let app = express();
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use('/', require('./routes/phase1'));
app.listen(8080, () => console.log('Running 8080'));
