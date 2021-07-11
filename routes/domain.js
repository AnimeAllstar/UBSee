const express = require('express');
const router = express.Router();

const domainController = require('../controllers/domain');

router.get('/*', domainController.redirect);

module.exports = router;