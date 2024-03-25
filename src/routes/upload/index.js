'use strict';

const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');

const router = express.Router();

// router.use(authentication);

router.post('/product', asyncHandler(uploadController.uploadImageFromUrl));

module.exports = router;