// this script runs tests on a JSON subject file at /public/json
// to run the script use 'npm run test [subject ID]'
// example : npm run test CPSC

const jsonfile = require('jsonfile');

const path = require('path');

// subject ID of new subject, passed using command line
const SUBJECT = process.argv[2].toUpperCase();

// filepath of subject file
const FILE = path.join(global.appRoot, '..', 'public', 'json', SUBJECT + '.json');

jsonfile.readFile(FILE, (err, obj) => {
    if (err) {
        console.log('Error while reading from ' + FILE);
        console.error(err);
    }
    const repeats = checkForRepeats(obj[SUBJECT]);
    if (repeats.length != 0) {
        console.log("repeats: " + repeats);
    } else {
        console.log("no repeats");
    }

    const missing = checkForMissing(obj[SUBJECT]);
    if (missing.length != 0) {
        console.log("missing: " + missing);
    } else {
        console.log("no missing");
    }

    console.log("tests complete");
})

// the test checks if a prereq string for any course for the specified subject 
// has multiple instances of a course in it and flags it this test is done 
// because there have been instances in the past where the prereqs are weird 
// and it doesn't hurt to check flagged courses to make sure that they are correct
// also checks if punctuations are present in prereq string, since they should not be present
function checkForRepeats(subjectJson) {
    const re = new RegExp(SUBJECT + "\\s\\d{3}", "g");
    let repeats = [];
    for (course in subjectJson) {
        const set = new Set();
        if (subjectJson[course].prereqText) {
            if (subjectJson[course].prereqs.match(/[.,:;'"!?]/)) {
                console.log(course + " contains an illegal character")
            }
            const prereqList = subjectJson[course].prereqText.match(re);
            if (prereqList) {
                prereqList.forEach((req) => {
                    if (!set.has(req)) {
                        set.add(req);
                    } else {
                        repeats.push(course + " has " + req);
                    }
                });
            }
        }
    }
    return repeats;
}

// this is a more important check
// it checks if there is a course included in the prerequisites that is not included in the keys of subjectJson
// this means that there is a non existant node being refereced to in the prereqs. 
// although there are checks in place to handle this type of scenario in graph-initializer, it means that we are missing
// data and the easiest way to solve this is to run the 'fix' script
function checkForMissing(subjectJson) {
    const re = new RegExp(SUBJECT + "\\s\\d{3}", "g");
    const prereqSet = new Set();
    for (course in subjectJson) {
        if (subjectJson[course].prereqText) {
            const prereqList = subjectJson[course].prereqText.match(re);
            if (prereqList) {
                prereqList.forEach((req) => {
                    if (!prereqSet.has(req)) {
                        prereqSet.add(req);
                    }
                });
            }
        }
    }
    const present = Object.keys(subjectJson);
    let missing = [];
    prereqSet.forEach((course) => {
        if (prereqSet.has(course) && !present.includes(course)) {
            missing.push(course);
        }
    })
    return missing;
}