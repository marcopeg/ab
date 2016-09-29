
const Card = require('../models/card');

module.exports = (req, res) => {

    let query = {
        _id: req.params.cid,
    };

    let payload = {
        $set: req.body,
    };

    Card.update(query, payload)
        .then(() => res.send({ status: 'ok' }))
        .catch(err => res.send(err));
};
