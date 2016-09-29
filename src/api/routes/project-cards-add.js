
const Card = require('../models/card');

module.exports = (req, res) => {

    var cardData = {
        pid: req.project._id,
        text: req.body.text,
        type: req.body.type,
        weight: 0,
        order: 0,
    };

    (new Card(cardData)).save()
        .then(() => res.send({ status: 'ok' }))
        .catch(err => res.status(500).send(err));

};
