const path = require('path');
const jsonfile = require('jsonfile');
const source = path.join(global.appRoot, 'public', 'json', 'courses.json');

module.exports.read = (req, res, callback) => {
    jsonfile.readFile(source, (err, obj) => {
        if (err) {
            console.error(err);
        }
        callback(req, res, obj);
    })
}