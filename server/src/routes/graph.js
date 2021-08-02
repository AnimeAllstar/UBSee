// This file handles all routes that involve rendering pages with graphs
const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home');
const subjectController = require('../controllers/subject');
const courseController = require('../controllers/course');

router.get('/', homeController.renderHome);

router.get('/subject/:subject/course/:course', courseController.renderCourse);

router.get('/subject/:subject', subjectController.renderSubject);

module.exports = router;