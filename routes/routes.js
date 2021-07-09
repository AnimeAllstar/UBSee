const express = require('express');
const router = express.Router();

const domainController = require('../controllers/domain');
const indexController = require('../controllers/index');
const subjectController = require('../controllers/subject');
const courseController = require('../controllers/course');

router.get('/*', domainController.redirect);

router.get('/', indexController.renderIndex);

router.get('/subject/:subject/course/:course', courseController.renderCourse);

router.get('/subject/:subject', subjectController.renderSubject);

module.exports = router;