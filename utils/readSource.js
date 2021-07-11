const jsonfile = require('jsonfile');
const path = require('path');
const appRoot = require('../utils/app-root');
const source = path.join(appRoot, '..', 'data', 'json', 'courses.json');

// reads source.json [./data/json/courses.json] and calls callback
module.exports.read = (arg0, arg1, callback) => {
    jsonfile.readFile(source, (err, obj) => {
        if (err) {
            console.error(err);
        }
        callback(arg0, arg1, obj);
    })
}