
const Project = require('../models/project');

module.exports = (req, res) => {

    if (!req.body.question) {
        return res.status(500).send('please provide a question you want to solve!');
    }

    (new Project()).save()
        .then(project => {
            return project.update({
                $set: {
                    pid: project._id,
                    question: req.body.question,
                },
            }).then(() => Project.findOne({ _id: project._id }));
        })
        .then(project => res.redirect('/' + project.pid))
        .catch(err => res.status(500).send(err));
};
