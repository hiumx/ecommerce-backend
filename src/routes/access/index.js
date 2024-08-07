
const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler  = require('../../helpers/asyncHandler');
const { authentication, authenticationRefreshToken } = require('../../auth/checkAuth');
const router = express.Router();

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

router.use(authentication);

router.post('/shop/logout', asyncHandler(accessController.logout));


router.post('/shop/handleRefreshToken', authenticationRefreshToken ,asyncHandler(accessController.handleRefreshToken));

module.exports = router;   