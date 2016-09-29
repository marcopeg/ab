
const template = require('../utils/template');

module.exports = (req, res) => {
    template('home', {})
        .then(html => res.send(html))
        .catch(err => res.status(500).send(err));
};
