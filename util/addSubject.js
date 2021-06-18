const needle = require('needle');
const jsonfile = require('jsonfile');

const path = require('path');
const ROOT = require('../util/path');

// API used to get relevant data
const UBCCOURSES = 'https://api.ubccourses.com/course/';
const UBCEXPLORER = 'https://ubcexplorer.io/searchAny/';

// used to store json data for new subject
const newSubject = {};

// keeps track of number of completed requests to UBCEXPLORER
let completedRequests = 0;

function addSubject(subject) {
  newSubject[subject] = [];

  // GET request to UBCCOURSES for all the data of all courses in the subject
  needle.get(UBCCOURSES + subject, (err, response) => {
    if (!err && response.statusCode == 200) {
      // populates the newSubject[subject] array with courses
      response.body.courses.forEach((course) => {
        if (course.course.length === 3 && course.course < 500) {
          newSubject[subject].push({
            name: course.name,
            title: course.title,
            url: course.link,
            prereqs: [
              []
            ],
            prereqText: '',
          });
        }
      });

      // sorts courses in ascending order
      newSubject[subject].sort((t, o) => (t.name > o.name ? 1 : -1));

      // makes multiple request to UBCEXPLORER to get 'prereqText' for each course
      for (let i = 0; i < newSubject[subject].length; i++) {
        const c = newSubject[subject][i].name.split(' ');
        needle.get(`${UBCEXPLORER}${c[0]}%20${c[1]}`, (err, response) => {
          if (!err && response.statusCode == 200) {
            // increments completedRequests if request is successful
            completedRequests++;
            // set prereqText for course
            if (response.body[0].prer) {
              newSubject[subject][i].prereqText = response.body[0].prer;
            } else {
              newSubject[subject][i].prereqText = 'None';
            }
          }

          // if all requests are completed, write the newSubject as a json
          if (completedRequests === newSubject[subject].length) {
            const file = path.join(ROOT, 'public', 'json', subject + '_TEMP.json');
            jsonfile.writeFile(file, newSubject, function (err) {
              if (err) {
                console.error(err);
              } else {
                console.log('Completed file write to ' + ROOT + 'data.json');
              }
            });
          }
        });
      }
    } else {
      console.log(err);
    }
  });
}

module.exports = addSubject;