const express = require('express');
const router = express.Router();

const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');

router.use(authentication)

router.get('', asyncHandler(discountController.getAllDiscountsByShop));
router.get('/:discountCode', asyncHandler(discountController.getAllProductWithDiscountCode));
router.post('', asyncHandler(discountController.createNewDiscount));
router.patch('/:discountId', asyncHandler(discountController.updateDiscount));

module.exports = router;