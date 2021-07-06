const express = require('express');
const jsonfile = require('jsonfile')

const path = require('path');
const ROOT = require('../util/path');

const router = express.Router();

const source = path.join(ROOT, 'public', 'json', 'courses.json');

router.get('/*', (req, res, next) => {
  if (req.hostname === 'ubsee.herokuapp.com') {
    res.redirect(301, 'https://ubsee.dev' + req.originalUrl);
  }
  return next();
});

router.get('/', (req, res) => {
  jsonfile.readFile(source, (err, obj) => {
    if (err) {
      console.error(err);
    }
    res.render(path.join(ROOT, 'views', 'index.html'), {
      title: 'UBSee - Creates interactive graphs for UBC subjects and courses',
      subjects: Object.keys(obj.courses),
      description: 'UBSee - Creates interactive graphs for UBC subjects and courses',
      robots: 'index, follow',
      keywords: 'UBSee, UBC, graphs'
    });
  })
});

router.get('/subject/:subject/course/:course', (req, res) => {
  jsonfile.readFile(source, (err, obj) => {
    if (err) {
      console.error(err);
    }
    const sub = req.params.subject;
    if (!Object.keys(obj.courses).includes(sub)) {
      res.redirect(`/invalid-subject/${sub}`);
    } else if (!Object.keys(obj.courses[sub]).includes(`${sub} ${req.params.course}`)) {
      res.redirect(`/invalid-course/${sub}${req.params.course}`);
    } else {
      res.render(path.join(ROOT, 'views', 'index.html'), {
        subject: sub,
        course: req.params.course,
        subjects: Object.keys(obj.courses),
        title: `${sub} ${req.params.course} - UBSee`,
        description: `Course graph for ${sub} ${req.params.course}`,
        robots: 'index, follow',
        keywords: `UBSee, UBC, course graph, ${sub}, ${sub} ${req.params.course}`
      });
    }
  })
});

router.get('/subject/:subject', (req, res) => {
  jsonfile.readFile(source, (err, obj) => {
    if (err) {
      console.error(err);
    }
    const sub = req.params.subject;
    if (Object.keys(obj.courses).includes(sub)) {
      res.render(path.join(ROOT, 'views', 'index.html'), {
        subject: sub,
        subjects: Object.keys(obj.courses),
        title: `${sub} - UBSee`,
        description: `Subject graph for ${sub}`,
        robots: 'index, follow',
        keywords: `UBSee, UBC, subject graph, ${sub}`
      });
    } else {
      res.redirect(`/invalid-subject/${sub}`);
    }
  })
});

module.exports = router;