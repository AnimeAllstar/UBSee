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

//const addSubjectHelper = require('../util/addSubject.js');

// helper to add new subject data using available api
// router.get('/addSubject/:subject', (req, res) => {
//   addSubjectHelper(req.params.subject);
//   res.send('check terminal');
// });

module.exports = router;