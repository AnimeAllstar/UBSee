const getdb = require('../utils/database').getdb;

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

    save() {
        const db = getdb();
        db.collection('courses').insertOne(this, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('done');
        });
    }

    static saveAll(courses) {
        const db = getdb();
        db.collection('courses').insertMany(courses, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('done');
        });
    }

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