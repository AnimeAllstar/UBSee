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
      title: 'UBCee',
      subjects: Object.keys(obj.courses),
    });
  })
});

router.get('/subject/:subject/course/:course', (req, res) => {
  jsonfile.readFile(source, (err, obj) => {
    if (err) {
      console.error(err);
    }
    let p;
    let data;
    const sub = req.params.subject;
    if (!Object.keys(obj.courses).includes(sub)) {
      res.redirect('/invalid-subject');
    } else if (!Object.keys(obj.courses[sub]).includes(`${sub} ${req.params.course}`)) {
      res.redirect('/invalid-course');
    } else {
      p = path.join(ROOT, 'views', 'index.html');
      data = {
        subject: sub,
        course: req.params.course,
        subjects: Object.keys(obj.courses),
        title: `${sub} ${req.params.course} - UBCee`
      }
    }

    res.render(p, data);
  })
});

router.get('/subject/:subject', (req, res) => {
  jsonfile.readFile(source, (err, obj) => {
    if (err) {
      console.error(err);
    }
    if (Object.keys(obj.courses).includes(req.params.subject)) {
      res.render(path.join(ROOT, 'views', 'index.html'), {
        subject: req.params.subject,
        subjects: Object.keys(obj.courses),
        title: `${req.params.subject} - UBCee`
      });
    } else {
      res.redirect('/invalid-subject');
    }
  })
});

module.exports = router;