
const express = require('express');
const Card = require('../models/card');

let router = express.Router();

router.get('/', (req, res) => {
    Card.find().sort({ order: 1 })
        .then(cards => res.send(cards))
        .catch(err => res.status(500).send(err));
});

router.post('/', (req, res) => {
    (new Card(req.body)).save()
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
        .map((cardId, idx) => Card.update({ _id: cardId}, {
            $set: {
                type: req.body.type,
                order: idx,
            },
        }))
        .forEach(updatePromise => updateAll.push(updatePromise));

    Promise.all(updateAll)
        .then(() => res.send({ status: 'ok' }))
        .catch(err => res.status(500).send(err));
});

router.put('/merge', (req, res) => {

    Card.find({ _id: { $in: req.body.cards } }).sort({ order: 1 })
        // build new card with merged informations
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
                weight: roundScore(weight),
            };

            (new Card(data)).save()
            .then(() => resolve(cards))
            .catch(reject);
        }))
        // delete former cards
        .then(cards => Card.remove({ _id: { $in: req.body.cards } }))
        .then(() => res.send({ status: 'ok' }))
        .catch(err => res.status(500).send(err));
});

router.put('/:id', (req, res) => {
    Card.update({ _id: req.params.id }, { $set: req.body })
        .then(() => res.send({ status: 'ok' }))
        .catch(err => res.send(err));
});

module.exports = router;

// in an ideal world this should be tested :-)
function roundScore(val) {
    val = val || 0;
    if ([0, 1, 2, 3, 5, 8, 13, 20, 40, 100].indexOf(val) !== -1) {
        return val;
    } else if (val === 4) {
        return 5;
    } else if (val < 8) {
        return 8;
    } else if (val < 13) {
        return 13;
    } else if (val < 20) {
        return 20;
    } else if (val < 40) {
        return 40;
    } else {
        return 100;
    }
}
