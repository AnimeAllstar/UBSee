const jsonfile = require('jsonfile');
const path = require('path');
const source = path.join(global.appRoot, 'data', 'json', 'courses.json');

module.exports.read = (arg0, arg1, callback) => {
    jsonfile.readFile(source, (err, obj) => {
        if (err) {
            console.error(err);
        }
        callback(arg0, arg1, obj);
    })
}