
const express = require('express');
const Note = require('../models/note');

let router = express.Router();

router.get('/', (req, res) => {
    Note.find()
        // no empty cards or one word cards
        // (to be fixed by validation)
        .then(cards => cards.filter(card => card.text !== ''))
        .then(cards => cards.filter(card => card.text.indexOf(' ') !== -1))
        // normalize card type
        .then(cards => cards.map(card => {
            card.type = card.type === 'Pro' ? 'pros' : 'cons';
            return card;
        }))
        .then(cards => res.send(cards))
        .catch(err => res.status(500).send(err));
});

router.post('/', (req, res) => {
    var note = new Note(req.body);
    note.save()
        .then(() => res.send({ status: 'ok' }))
        .catch(err => res.send(err));
});

module.exports = router;