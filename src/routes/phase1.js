
const express = require('express');
const Note = require('../models/note');

let router = express.Router();

router.post('/', (req, res) => {

    var note = new Note(req.body);

    note.save()
        .then(() => res.send({ status: 'ok' }))
        .catch(err => res.send(err));
});

module.exports = router;
