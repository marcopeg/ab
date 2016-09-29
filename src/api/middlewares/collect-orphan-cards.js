/**
 * Assign all the orphan cards to the current project
 */

const Card = require('../models/card');

module.exports = (req, res, next) => {

    let query = {
        pid: null,
    };

    let payload = {
        $set: {
            pid: req.project._id,
        },
    };

    let updateAll = [];

    Card.find(query)
        .then(cards => cards.map(card => {
            let updateCard = Card.update({ _id: card._id }, payload);
            updateAll.push(updateCard);
        }))
        .then(() => Promise.all(updateAll))
        .then(() => next())
        .catch(err => res.status(500).send(err));
};
