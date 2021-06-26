const express = require('express');
const router = express.Router();

const path = require('path');
const ROOT = require('../util/path');

router.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'views', 'index.html'));
});

router.get('/subject/:subjectId/course/:courseId', (req, res) => {
  // TODO
  // error handling to be added to check if subjectId and courseId are valid
  // add new view / send data about subjectId and courseId
  res.sendFile(path.join(ROOT, 'views', 'index.html'));
});

module.exports = router;