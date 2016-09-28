
const express = require('express');
const Card = require('../models/card');

let router = express.Router();

router.get('/', (req, res) => {
    Card.find().sort({ order: 1 })
        .then(cards => res.send(cards))
        .catch(err => res.status(500).send(err));
});

router.post('/', (req, res) => {
    var note = new Card(req.body);
    note.save()
        .then(() => res.send({ status: 'ok' }))
        .catch(err => res.send(err));
});

router.delete('/:id', (req, res) => {
    Card.remove({ _id: req.params.id })
    .then(() => res.send({ status: 'ok' }))
    .catch(err => res.status(500).send(err));
});

router.put('/sort', (req, res) => {
    var updateAll = [];

    req.body.cards
        .map((cardId, idx) => {

            return Card.update({ _id: cardId}, {
                $set: {
                    type: req.body.type,
                    order: idx,
                },
            })

        })
        .forEach(updatePromise => updateAll.push(updatePromise));

    Promise.all(updateAll)
    .then(() => res.send({ status: 'ok' }))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
