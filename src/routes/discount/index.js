const express = require('express');
const router = express.Router();

const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');

router.get('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/all', asyncHandler(discountController.getAllProductWithDiscountCode));
router.post('/cancel', asyncHandler(discountController.cancelDiscountByUser));

router.use(authentication);

router.post('', asyncHandler(discountController.createNewDiscount));

router.get('', asyncHandler(discountController.getAllDiscountsByShop));

router.patch('/:discountId', asyncHandler(discountController.updateDiscount));

router.delete('', asyncHandler(discountController.deleteDiscount));

module.exports = router;