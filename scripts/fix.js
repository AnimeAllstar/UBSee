// this script tries to fix a 'missing' course error in API data that might show up if your run the 'test' script
// to run this script use 'npm run fix [subject ID] [course ID]'
// example : npm run test CPSC 210

const needle = require('needle');
const sortJson = require('sort-json');
const jsonfile = require('jsonfile');

const path = require('path');
const ROOT = require('../util/path');

// API used to get relevant data
const UBCEXPLORER = 'https://ubcexplorer.io/searchAny/';

// subject ID of new subject, and course ID of new subject passed using command line
const SUBJECT = process.argv[2].toUpperCase();
const COURSE = process.argv[3].toUpperCase();

// filepath of subject file
const FILE = path.join(ROOT, '..', 'public', 'json', SUBJECT + '.json');

jsonfile.readFile(FILE, (err, obj) => {
    if (err) {
        console.log('Error while reading from ' + FILE);
        console.error(err);
    }
    if (Object.keys(obj[SUBJECT]).includes(SUBJECT + " " + COURSE)) {
        console.log("Course is present within data");
    } else {
        addMissingCourse(obj);
    }
});

// get course data from UBCEXPLORER
// add data to subjectJson
// write to FILE
// sort FILE
function addMissingCourse(subjectJson) {
    needle.get(`${UBCEXPLORER}${SUBJECT}%20${COURSE}`, (err, response) => {
        if (!err && response.statusCode == 200) {
            const apiData = response.body[0];
            const newCourse = {
                name: apiData.code,
                prereqs: '',
                prereqText: apiData.prer,
                title: apiData.name,
                url: apiData.link,
            };
            subjectJson[SUBJECT][newCourse.name] = newCourse;
            jsonfile.writeFile(FILE, subjectJson, (err) => {
                if (err) {
                    console.log('Error while appending to ' + FILE);
                    console.error(err);
                } else {
                    sortJson.overwrite(FILE, {
                        ignoreCase: true
                    });
                    console.log("Course Added");
                }
            });
        } else {
            console.log("Error while fetching data from UBCEXPLORER");
            console.error(err);
        }
    });
}