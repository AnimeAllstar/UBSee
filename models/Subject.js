const getdb = require('../utils/database').getdb;

class Subject {
    constructor(name) {
        this.name = name;
        this.courses = [];
    }

    addCourse(course) {
        this.courses.push(course);
    }

    save() {
        const db = getdb();
        db.collection('subjects').insertOne(this, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('done');
        });
    }

    static saveAll(subjects) {
        const db = getdb();
        db.collection('subjects').insertMany(subjects, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('done');
        });
    }

    static getAllNames(callback) {
        const db = getdb();
        db.collection('subjects')
            .find()
            .project({
                name: 1
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

module.exports = Subject;