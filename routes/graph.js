const express = require('express');
const router = express.Router();

const indexController = require('../controllers/index');
const subjectController = require('../controllers/subject');
const courseController = require('../controllers/course');

router.get('/', indexController.renderIndex);

router.get('/subject/:subject/course/:course', courseController.renderCourse);

router.get('/subject/:subject', subjectController.renderSubject);

module.exports = router;