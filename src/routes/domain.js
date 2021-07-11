// This file used domainController to check if a request needs to be redirect
const express = require('express');
const router = express.Router();

const domainController = require('../controllers/domain');

router.get('/*', domainController.redirect);

module.exports = router;