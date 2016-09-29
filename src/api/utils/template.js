
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');


module.exports = (templateName, templateData) => new Promise((resolve, reject) => {
    let templatePath = path.join('/', 'usr', 'src', 'html', templateName + '.tpl.html');
    fs.readFile(templatePath, 'UTF-8', (err, templateSource) => {
        if (err) {
            return reject(err);
        }
        try {
            let templateResult = mustache.render(templateSource, templateData);
            resolve(templateResult);
        } catch(e) {
            reject(e);
        }
    });
});
