/**
 * Fetches the PID from the request params and loads the Project's model
 */

const Project = require('../models/project');

module.exports = (req, res, next) => {
    let pid = req.params.pid;

    Project.findOne({ pid: pid })
        .then(project => {
            if (!project) {
                return (new Project({
                    pid: pid,
                })).save();
            }
            return project;
        })
        .then(project => {
            project.question = project.question || project.pid;
            return project;
        })
        .then(project => req.project = project)
        .then(() => next())
        .catch(err => res.status(500).send(err));
};
