
const template = require('../utils/template');

module.exports = (req, res) => {
    template('brainstorm', req.project)
        .then(html => res.send(html))
        .catch(err => res.status(500).send(err));
};
