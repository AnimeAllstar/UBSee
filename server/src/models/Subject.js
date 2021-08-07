const getdb = require('../utils/database').getdb;

// Subject Object
class Subject {
  constructor(name) {
    this.name = name;
    this.courses = [];
  }

  // add course to this.courses
  addCourse(course) {
    this.courses.push(course);
  }

  // save this to the subjects collection
  save() {
    const db = getdb();
    db.collection('subjects').insertOne(this, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('subject saved');
      }
    });
  }

  // save multiple subjects to the subjects collection
  static saveAll(subjects) {
    const db = getdb();
    db.collection('subjects').insertMany(subjects, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('all subjects saved');
      }
    });
  }

  // returns an array of all documents in subjects collection
  static getAllNames(callback) {
    const db = getdb();
    db.collection('subjects')
      .find()
      .project({
        name: 1,
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
