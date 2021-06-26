const express = require('express');
const router = express.Router();

const path = require('path');
const ROOT = require('../util/path');

router.get('/', (req, res) => {
  res.render(path.join(ROOT, 'views', 'index.html'), {
    title: 'UBC Degree Visualizer'
  });
});

router.get('/subject/:subject/course/:course', (req, res) => {
  // TODO
  // error handling to be added to check if subjectId and courseId are valid
  // add new view / send data about subjectId and courseId

  res.render(path.join(ROOT, 'views', 'index.html'), {
    subject: req.params.subject,
    course: req.params.course,
    title: `${req.params.subject} ${req.params.course} - UBC Degree Visualizer`
  });
});

module.exports = router;