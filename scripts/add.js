// this script creates a new JSON file for any subject at UBC van and stores it at /data/json
// to run the script use 'npm run add [subject ID]'
// example : npm run add CPSC
// use the command to add more subjects to this project
// the prereqs array needs to be manually added for each course after the JSON is generated

const needle = require('needle');
const sortJson = require('sort-json');
const jsonfile = require('jsonfile');

const path = require('path');

const appRoot = require('../utils/app-root');

// API used to get relevant data
const UBCCOURSES = 'https://api.ubccourses.com/course/';
const UBCEXPLORER = 'https://ubcexplorer.io/searchAny/';

// subject ID of new subject, passed using command line
const subject = process.argv[2].toUpperCase();

// used to store json data for new subject
const newSubject = {};
newSubject[subject] = {};

// GET request to UBCCOURSES for all the data of all courses in the subject
needle.get(UBCCOURSES + subject, (err, response) => {
  if (!err && response.statusCode == 200) {
    // populates the newSubject[subject] array with courses
    response.body.courses.forEach((course) => {
      if (course.course.length === 3 && course.course < 500) {
        newSubject[subject][course.name] = {
          name: course.name,
          title: course.title,
          url: course.link,
          prereqs: '',
          prereqText: '',
        };
      }
    });

    // keeps track of number of completed requests to UBCEXPLORER
    let completedRequests = 0;

    // makes multiple request to UBCEXPLORER to get 'prereqText' for each course
    for (const course in newSubject[subject]) {
      const c = newSubject[subject][course].name.split(' ');
      needle.get(`${UBCEXPLORER}${c[0]}%20${c[1]}`, (err, response) => {
        if (!err && response.statusCode == 200) {
          // increments completedRequests if request is successful
          completedRequests++;
          // set prereqText for course
          if (response.body[0].prer) {
            newSubject[subject][course].prereqText = response.body[0].prer;
          } else {
            newSubject[subject][course].prereqText = 'None';
          }
        } else {
          console.log("Error while fetching data from UBCEXPLORER");
          console.error(err);
        }

        // if all requests are completed, write the newSubject as a json
        if (completedRequests === Object.keys(newSubject[subject]).length) {

          // sorts newSubject[subject] using course names
          newSubject[subject] = sortJson(newSubject[subject], {
            ignoreCase: true
          });

          // _TEMP insures that the file is not overwrited
          const file = path.join(appRoot, '..', 'data', 'json', subject + '_TEMP.json');
          jsonfile.writeFile(file, newSubject, function (err) {
            if (err) {
              console.log('Error while writing to ' + file);
              console.error(err);
            } else {
              console.log('Completed file write to ' + appRoot + 'data.json');
            }
          });
        }
      });
    }
  } else {
    console.log("Error while fetching data from UBCCOURSES");
    console.log(err);
  }
});