'use strict';

const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');
const { diskStorage, memoryStorage } = require('../../configs/multer.config');

const router = express.Router();

// router.use(authentication);

router.post('/product', asyncHandler(uploadController.uploadImageFromUrl));
router.post('/product/thumb', diskStorage.single('file'), asyncHandler(uploadController.uploadImageFromLocal));
router.post('/product/thumbs', diskStorage.array('files', 8), asyncHandler(uploadController.uploadImagesFromLocal));

// S3
router.post('/product/bucket', memoryStorage.single('file'), asyncHandler(uploadController.uploadImagesFromLocalS3));


module.exports = router;   