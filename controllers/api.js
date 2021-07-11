const getdb = require('../utils/database').getdb;

module.exports.getCourse = (req, res) => {
    const db = getdb();
    db.collection('courses').findOne({
        name: `${req.params.subject} ${req.params.course}`,
    }, (err, result) => {
        if (err) {
            console.log(err);
        }
        if (!result) {
            res.status(404).send('Course not found');
        } else {
            res.send(result);
        }
    });
};

function restrict(val, min, max) {
    if (val) {
        return val > max ? max : val < min ? max : val;
    }
    return max;
}

module.exports.getSubject = (req, res) => {
    const db = getdb();
    db.collection('courses')
        .find({
            subject: req.params.subject,
            year: {
                $lte: restrict(req.query.year, 1, 4).toString(),
            },
        })
        .toArray((err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.length === 0) {
                res.status(404).send('Subject not found');
            } else {
                res.send(result);
            }
        });
};

module.exports.getSubjects = (req, res) => {
    const db = getdb();
    db.collection('subjects')
        .find()
        .toArray((err, result) => {
            if (err) {
                console.log(err);
            }
            if (!result) {
                res.status(404).send('No subjects available');
            } else {
                res.send(result);
            }
        });
};

module.exports.getCourses = (req, res) => {
    const db = getdb();
    db.collection('subjects')
        .find({
            name: req.params.subject,
        })
        .project({
            courses: 1
        })
        .toArray((err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.length === 0) {
                res.status(404).send('Courses not found');
            } else {
                res.send(result);
            }
        })
};