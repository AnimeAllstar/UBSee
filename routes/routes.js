const express = require('express');
const router = express.Router();

const apiController = require('../controllers/api');
const domainController = require('../controllers/domain');
const indexController = require('../controllers/index');
const subjectController = require('../controllers/subject');
const courseController = require('../controllers/course');

router.get('/*', domainController.redirect);

router.get('/', indexController.renderIndex);

router.get('/subject/:subject/course/:course', courseController.renderCourse);

router.get('/subject/:subject', subjectController.renderSubject);

router.get('/api/subject/:subject/course/:course', apiController.getCourse);

router.get('/api/subject/:subject', apiController.getSubject);

router.get('/api/subjects/', apiController.getSubjects);

router.get('/api/courses/:subject', apiController.getCourses);

module.exports = router;