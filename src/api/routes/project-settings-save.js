
const Project = require('../models/project');

module.exports = (req, res) => {

    let query = {
        _id: req.project._id,
    };

    let payload = {
        $set: req.body,
    };

    Project.update(query, payload)
        .then(() => res.send({ status: 'ok' }))
        .catch(err => res.send(err));
};
