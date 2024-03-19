const express = require('express');
const router = express.Router();

const notificationController = require('../../controllers/notification.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/checkAuth');

//Here notifies for user not login yet.

router.use(authentication);

router.get('', asyncHandler(notificationController.listNotifiesByUser));

module.exports = router;