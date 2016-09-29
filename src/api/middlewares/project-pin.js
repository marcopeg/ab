/**
 * Fetches the PID from the request params and loads the Project's model
 */

const template = require('../utils/template');

module.exports = (req, res, next) => {

    if (!req.project.pin || req.session.pin === req.project.pin) {
        return next();
    }

    if (req.body.pin === req.project.pin) {
        req.session.pin = req.project.pin;
        return next();
    }

    template('pin', req.project)
        .then(html => res.send(html))
        .catch(err => res.status(500).send(err));
};
