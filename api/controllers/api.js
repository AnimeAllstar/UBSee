const getdb = require('../utils/database').getdb;

// gets course using request params from courses collection
module.exports.getCourse = (req, res, next) => {
  const db = getdb();
  db.collection('courses').findOne(
    {
      name: `${req.params.subject} ${req.params.course}`,
    },
    (err, result) => {
      handleResponse(err, result, res, next);
    }
  );
};

// gets subject using request param and year query from courses collection
module.exports.getSubject = (req, res, next) => {
  const db = getdb();
  db.collection('courses')
    .find({
      subject: req.params.subject,
      year: {
        $lte: restrict(req.query.year, 1, 4).toString(),
      },
    })
    .toArray((err, result) => {
      handleResponse(err, result, res, next);
    });
};

// gets all subjects from subjects collection
module.exports.getSubjects = (req, res, next) => {
  const db = getdb();
  db.collection('subjects')
    .find()
    .toArray((err, result) => {
      handleResponse(err, result, res, next);
    });
};

// used to restrict val between min and max
function restrict(val, min, max) {
  if (val) {
    return val > max ? max : val < min ? max : val;
  }
  return max;
}

// handles the response from the database
function handleResponse(err, result, res, next) {
  if (err) {
    console.error(err);
  }
  if (!result) {
    next();
  } else {
    res.send(result);
  }
}
