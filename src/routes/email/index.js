'use strict';

const express = require('express');
const emailController = require('../../controllers/email.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');

const router = express.Router();

// router.use(authentication);

router.post('/new-template', asyncHandler(emailController.createTemplate));

module.exports = router;   