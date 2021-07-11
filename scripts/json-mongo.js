// this script is used to add data from ./data/json/courses.json to MongoDB

const Subject = require('../models/Subject');
const Course = require('../models/Course');
const mongoConnect = require('../utils/database').connect;
const readJson = require('../utils/readSource');

// adds data to the subjects collection
function addSubjects() {
    readJson.read(null, null, (arg0, arg1, obj) => {
        const courses = obj.courses;
        const subjectsArr = [];
        for (subject in courses) {
            const sub = new Subject(subject);
            for (course in courses[subject]) {
                sub.addCourse(`${courses[subject][course].name} - ${courses[subject][course].title}`)
            }
            subjectsArr.push(sub);
        }
        mongoConnect(() => {
            Subject.saveAll(subjectsArr);
        });
    });
}

// adds data to the subjects courses
function addCourses() {
    readJson.read(null, null, (arg0, arg1, obj) => {
        const courses = obj.courses;
        const coursesArr = [];
        for (subject in courses) {
            for (course in courses[subject]) {
                const sub = courses[subject];
                const c = new Course(sub[course].name, sub[course].prereqs, sub[course].prereqText, sub[course].title, sub[course].url);
                coursesArr.push(c);
            }
        }
        mongoConnect(() => {
            Course.saveAll(coursesArr);
        });
    });
}

// DO NOT UNCOMMENT UNLESS YOU WANT TO ADD DATA TO THE DATABASE
// addSubjects();
// addCourses();