
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser')

// database
mongoose.connect('mongodb://db/qa');

// server
let app = express();
app.use(express.static('/usr/src/html'));
app.use(bodyParser.json());

app.get('/:pid',
    require('./middlewares/ensure-project'),
    require('./routes/project'));

app.post('/:pid',
    require('./middlewares/ensure-project'),
    require('./routes/project-add-card'));

app.get('/', require('./routes/home'));

app.listen(8080, () => console.log('Running 8080'));
