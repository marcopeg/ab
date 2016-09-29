
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser')

// database
mongoose.connect('mongodb://db/qa');

// server
let app = express();
app.use(express.static('/usr/src/html'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/:pid',
    require('./middlewares/ensure-project'),
    require('./routes/project'));

app.get('/:pid/review',
    require('./middlewares/ensure-project'),
    require('./middlewares/collect-orphan-cards'),
    require('./routes/project-review'));

app.get('/:pid/cards',
    require('./middlewares/ensure-project'),
    require('./routes/project-cards-get'));

app.post('/:pid/cards',
    require('./middlewares/ensure-project'),
    require('./routes/project-cards-add'));

app.delete('/:pid/cards/:cid',
    require('./middlewares/ensure-project'),
    require('./routes/project-cards-delete'));

app.put('/:pid/cards/sort',
    require('./middlewares/ensure-project'),
    require('./routes/project-cards-sort'));

app.put('/:pid/cards/merge',
    require('./middlewares/ensure-project'),
    require('./routes/project-cards-merge'));

app.put('/:pid/cards/:cid',
    require('./middlewares/ensure-project'),
    require('./routes/project-cards-update'));

app.get('/', require('./routes/home'));
app.post('/', require('./routes/project-create'));

app.listen(8080, () => console.log('Running 8080'));
