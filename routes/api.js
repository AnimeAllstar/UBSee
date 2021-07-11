const express = require('express');
const router = express.Router();

const apiController = require('../controllers/api');

router.get('/subject/:subject/course/:course', apiController.getCourse);

router.get('/subject/:subject', apiController.getSubject);

router.get('/subjects/', apiController.getSubjects);

router.get('/courses/:subject', apiController.getCourses);

module.exports = router;