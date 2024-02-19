const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');

const router = express.Router();

router.use(authentication);

router.post('', asyncHandler(productController.createProduct));

module.exports = router;