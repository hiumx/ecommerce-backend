const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');

const router = express.Router();

router.get('', asyncHandler(productController.findAllProducts));
router.get('/:id', asyncHandler(productController.findProductByUser));

router.use(authentication);

router.post('', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

router.get('/draft/all', asyncHandler(productController.getAllDraftProductByShop));
router.get('/published/all', asyncHandler(productController.getAllPublishedProductByShop));
router.get('/search/:keySearch', asyncHandler(productController.searchProductsByUser));

module.exports = router;