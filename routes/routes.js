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
      title: 'UBSee - Creates interactive graphs for UBC subjects and courses',
      subjects: Object.keys(obj.courses),
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
        title: `${sub} ${req.params.course} - UBSee`
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
        title: `${sub} - UBSee`
      });
    } else {
      res.redirect(`/invalid-subject/${sub}`);
    }
  })
});

module.exports = router;