
const Card = require('../models/card');

module.exports = (req, res) => {

    let query = {
        _id: req.params.cid,
    };

    Card.remove(query)
        .then(() => res.send({ status: 'ok' }))
        .catch(err => res.status(500).send(err));
};
