'use strict';

const express = require('express');
const userController = require('../../controllers/user.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');

const router = express.Router();

// router.use(authentication);

router.post('/register', asyncHandler(userController.newUser));

module.exports = router;   