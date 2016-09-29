
const Card = require('../models/card');

module.exports = (req, res) => {
    let updateAll = [];

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
};
