
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

router.put('/:id', (req, res) => {
    Card.update({ _id: req.params.id }, { $set: req.body })
    .then(() => res.send({ status: 'ok' }))
    .catch(err => res.send(err));
})

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

router.put('/merge', (req, res) => {
    Card.find({ _id: { $in: req.body.cards } }).sort({ order: 1 })
    // build new merged card
    .then(cards => new Promise((resolve, reject) => {
        var weight = 0;
        var text = [];

        cards.forEach(card => {
            text.push(card.text);
            weight += parseInt(card.weight) || 1;
        });

        var data = {
            type: cards[0].type,
            text: text.join('\n'),
            weight: weight,
        };

        var merged = new Card(data);
        merged.save()
        .then(() => resolve(cards))
        .catch(reject);
    }))
    // delete former cards
    .then(cards => Card.remove({ _id: { $in: req.body.cards } }))
    .then(() => res.send({ status: 'ok' }))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
