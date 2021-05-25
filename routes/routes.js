const express = require('express');
const router = express.Router();

const path = require('path');
const ROOT = require('../util/path');

router.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'views', 'index.html'));
});

module.exports = router;
