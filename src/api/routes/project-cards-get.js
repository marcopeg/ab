
const Card = require('../models/card');

module.exports = (req, res) => {

    let query = {
        pid: req.project._id,
    };

    let order = {
        order: 1,
    };

    Card.find(query).sort(order)
        .then(cards => res.send(cards))
        .catch(err => res.status(500).send(err));
};
