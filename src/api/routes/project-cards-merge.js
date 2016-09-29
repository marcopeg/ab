
const Card = require('../models/card');

module.exports = (req, res) => {

    let query = {
        _id: {
            $in: req.body.cards,
        },
    };

    let order = {
        order: 1,
    };

    Card.find(query).sort(order)
        // build new card with merged informations
        .then(cards => new Promise((resolve, reject) => {

            let weight = 0;
            let text = [];

            cards.forEach(card => {
                text.push(card.text);
                weight += parseInt(card.weight) || 1;
            });

            var data = {
                pid: req.project._id,
                type: cards[0].type,
                text: text.join('\n'),
                weight: roundScore(weight),
                order: cards[0].order,
            };

            (new Card(data)).save()
                .then(() => resolve(cards))
                .catch(reject);
        }))
        // delete former cards
        .then(cards => Card.remove(query))
        .then(() => res.send({ status: 'ok' }))
        .catch(err => res.status(500).send(err));

};

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
