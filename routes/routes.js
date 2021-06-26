const express = require('express');
const jsonfile = require('jsonfile')

const path = require('path');
const ROOT = require('../util/path');

const router = express.Router();

const file = path.join(ROOT, 'public', 'json', 'courses.json');

router.get('/', (req, res) => {
  jsonfile.readFile(file, (err, obj) => {
    if (err) {
      console.error(err);
    }
    res.render(path.join(ROOT, 'views', 'index.html'), {
      title: 'UBC Degree Visualizer',
      subjects: Object.keys(obj.courses).sort(),
    });
  })
});

router.get('/subject/:subject/course/:course', (req, res) => {
  // TODO
  // error handling to be added to check if subjectId and courseId are valid
  // add new view / send data about subjectId and courseId

  jsonfile.readFile(file, (err, obj) => {
    if (err) {
      console.error(err);
    }
    res.render(path.join(ROOT, 'views', 'index.html'), {
      subject: req.params.subject,
      course: req.params.course,
      subjects: Object.keys(obj.courses).sort(),
      title: `${req.params.subject} ${req.params.course} - UBC Degree Visualizer`
    });
  })
});

module.exports = router;