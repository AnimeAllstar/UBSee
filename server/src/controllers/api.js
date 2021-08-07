const getdb = require('../utils/database').getdb;

// gets course using request params from courses collection
module.exports.getCourse = (req, res) => {
  const db = getdb();
  db.collection('courses').findOne(
    {
      name: `${req.params.subject} ${req.params.course}`,
    },
    (err, result) => {
      handleResponse(err, result, res);
    }
  );
};

// gets subject using request param and year query from courses collection
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
      handleResponse(err, result, res);
    });
};

// gets all subjects from subjects collection
module.exports.getSubjects = (req, res) => {
  const db = getdb();
  db.collection('subjects')
    .find()
    .toArray((err, result) => {
      handleResponse(err, result, res);
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
function handleResponse(err, result, res) {
  if (err) {
    console.log(err);
  }
  if (!result) {
    res.status(404).send('Not Found');
  } else {
    res.send(result);
  }
}
