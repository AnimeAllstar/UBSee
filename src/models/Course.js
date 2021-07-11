const getdb = require('../utils/database').getdb;

// Course Object
class Course {
    constructor(name, prereqs, prereqText, title, url) {
        this.subject = name.split(' ')[0];
        this.name = name;
        this.year = name.split(' ')[1].charAt(0);
        this.title = title;
        this.prereqs = prereqs;
        this.prereqText = prereqText;
        this.url = url;
    }

    // save this to the courses collection
    save() {
        const db = getdb();
        db.collection('courses').insertOne(this, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('course saved');
            }
        });
    }

    // save multiple courses to the courses collection
    static saveAll(courses) {
        const db = getdb();
        db.collection('courses').insertMany(courses, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('all courses saved');
            }
        });
    }

    // returns whether a course with name == filter exists in courses
    static exists(filter, callback) {
        const db = getdb();
        db.collection('courses')
            .find({
                name: filter,
            }, {
                $exists: true
            })
            .toArray()
            .then((result) => {
                callback(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

module.exports = Course;