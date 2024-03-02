const express = require('express');
const router = express.Router();

const cartController = require('../../controllers/cart.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');

router.post('', asyncHandler(cartController.addToCart));
router.post('/update', asyncHandler(cartController.updateToCart));
router.get('', asyncHandler(cartController.listToCart));
router.delete('', asyncHandler(cartController.deleteToCart));

module.exports = router;