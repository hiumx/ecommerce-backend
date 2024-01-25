const express = require('express');
const { home } = require('../../controllers/site.controller');

const router = express.Router();

router.get('/', home);

module.exports = router;