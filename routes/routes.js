const express = require('express');
const jsonfile = require('jsonfile')

const path = require('path');
const ROOT = require('../util/path');

const router = express.Router();

const source = path.join(ROOT, 'public', 'json', 'courses.json');

router.get('/', (req, res) => {
  jsonfile.readFile(source, (err, obj) => {
    if (err) {
      console.error(err);
    }
    res.render(path.join(ROOT, 'views', 'index.html'), {
      title: 'UBC Degree Visualizer',
      subjects: Object.keys(obj.courses),
    });
  })
});

router.get('/subject/:subject/course/:course', (req, res) => {
  // TODO
  // error handling to be added to check if subjectId and courseId are valid

  jsonfile.readFile(source, (err, obj) => {
    if (err) {
      console.error(err);
    }
    res.render(path.join(ROOT, 'views', 'index.html'), {
      subject: req.params.subject,
      course: req.params.course,
      subjects: Object.keys(obj.courses),
      title: `${req.params.subject} ${req.params.course} - UBC Degree Visualizer`
    });
  })
});

router.get('/subject/:subject', (req, res) => {
  // TODO
  // error handling to be added to check if subjectId is valid

  jsonfile.readFile(source, (err, obj) => {
    if (err) {
      console.error(err);
    }
    res.render(path.join(ROOT, 'views', 'index.html'), {
      subject: req.params.subject,
      subjects: Object.keys(obj.courses),
      title: `${req.params.subject} - UBC Degree Visualizer`
    });
  })
});

module.exports = router;